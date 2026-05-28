"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, X, FileText, ArrowLeft } from "lucide-react";

const API = "http://localhost:5000/api";

type LineItem = { description: string; quantity: number; unitPrice: number };
type Invoice = {
  _id: string; invoiceNumber: string; status: string; total: number; subtotal: number;
  taxRate: number; taxAmount: number; discount: number; notes: string; dueDate: string;
  createdAt: string;
  client: { name: string; email: string };
  serviceRequest: { serviceType: string; customServiceType: string; details: string; address: string };
  lineItems: LineItem[];
};
type Request = { _id: string; serviceType: string; customServiceType: string; user: { name: string; email: string }; status: string };

const STATUS_COLOR: Record<string, string> = {
  Sent:      "bg-blue-50 text-blue-700 border-blue-200",
  Paid:      "bg-green-50 text-green-700 border-green-200",
  Draft:     "bg-gray-50 text-gray-600 border-gray-200",
  Overdue:   "bg-red-50 text-red-700 border-red-200",
  Cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ProviderInvoicesPage() {
  const router = useRouter();
  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("providerToken") : null;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  // Form state
  const [form, setForm] = useState({
    serviceRequestId: "",
    lineItems: [{ description: "", quantity: 1, unitPrice: 0 }] as LineItem[],
    taxRate: 0,
    discount: 0,
    notes: "",
    dueDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    try {
      const [invRes, reqRes] = await Promise.all([
        fetch(`${API}/invoices/provider`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/providers/requests`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const invData = await invRes.json();
      const reqData = await reqRes.json();
      setInvoices(Array.isArray(invData) ? invData : []);
      setMyRequests(Array.isArray(reqData) ? reqData.filter((r: Request) => r.status === "Completed") : []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const addLine = () => setForm(f => ({ ...f, lineItems: [...f.lineItems, { description: "", quantity: 1, unitPrice: 0 }] }));
  const removeLine = (i: number) => setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) }));
  const updateLine = (i: number, key: keyof LineItem, value: string | number) =>
    setForm(f => { const li = [...f.lineItems]; li[i] = { ...li[i], [key]: value }; return { ...f, lineItems: li }; });

  const subtotal = form.lineItems.reduce((a, l) => a + l.quantity * l.unitPrice, 0);
  const taxAmt   = (subtotal * form.taxRate) / 100;
  const total    = subtotal + taxAmt - form.discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceRequestId) return alert("Select a service request");
    if (form.lineItems.some(l => !l.description)) return alert("Fill all line item descriptions");
    setSubmitting(true);
    const token = getToken();
    try {
      const res = await fetch(`${API}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to create invoice");
      setShowModal(false);
      setForm({ serviceRequestId: "", lineItems: [{ description: "", quantity: 1, unitPrice: 0 }], taxRate: 0, discount: 0, notes: "", dueDate: "" });
      fetchData();
    } catch { alert("Server error"); }
    finally { setSubmitting(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = getToken();
    await fetch(`${API}/invoices/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
              <ArrowLeft size={18} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-slate-800">Invoices</h1>
              <p className="text-xs text-slate-500">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95"
          >
            <Plus size={16} /> Create Invoice
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {invoices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="font-bold text-lg text-slate-600">No invoices yet</p>
            <p className="text-sm text-slate-400 mt-1">Create your first invoice from a completed job.</p>
            <button onClick={() => setShowModal(true)} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              Create Invoice
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map(inv => (
              <div key={inv._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-black text-slate-800 text-lg">{inv.invoiceNumber}</p>
                    <p className="text-slate-500 text-sm">To: <span className="font-semibold text-slate-700">{inv.client?.name}</span> · {inv.client?.email}</p>
                    <p className="text-slate-400 text-xs mt-1">{new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${STATUS_COLOR[inv.status] || ""}`}>{inv.status}</span>
                    <span className="text-xl font-black text-slate-800">₹{inv.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-slate-50/70 rounded-xl p-3 mb-4 border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Service</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {inv.serviceRequest?.serviceType === "Other" ? inv.serviceRequest?.customServiceType : inv.serviceRequest?.serviceType}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setViewInvoice(inv)} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
                    View Invoice
                  </button>
                  {inv.status === "Sent" && (
                    <button onClick={() => updateStatus(inv._id, "Paid")} className="px-4 py-2 bg-green-50 text-green-700 font-bold text-sm rounded-xl hover:bg-green-100 transition-colors">
                      Mark Paid
                    </button>
                  )}
                  {(inv.status === "Sent" || inv.status === "Draft") && (
                    <button onClick={() => updateStatus(inv._id, "Cancelled")} className="px-4 py-2 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Create Invoice Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-black text-slate-800">Create Invoice</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Select Request */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Completed Job *</label>
                <select
                  value={form.serviceRequestId}
                  onChange={e => setForm(f => ({ ...f, serviceRequestId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  required
                >
                  <option value="">— Select a completed job —</option>
                  {myRequests.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.serviceType === "Other" ? r.customServiceType : r.serviceType} — {r.user?.name}
                    </option>
                  ))}
                </select>
                {myRequests.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">⚠ No completed jobs found. Mark a job as Completed first.</p>
                )}
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-700">Line Items *</label>
                  <button type="button" onClick={addLine} className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:text-indigo-800">
                    <Plus size={14} /> Add Line
                  </button>
                </div>
                <div className="space-y-3">
                  {form.lineItems.map((line, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className="col-span-6 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
                        placeholder="Description"
                        value={line.description}
                        onChange={e => updateLine(i, "description", e.target.value)}
                        required
                      />
                      <input
                        type="number" min={1}
                        className="col-span-2 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 text-center"
                        placeholder="Qty"
                        value={line.quantity}
                        onChange={e => updateLine(i, "quantity", Number(e.target.value))}
                      />
                      <input
                        type="number" min={0}
                        className="col-span-3 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
                        placeholder="₹ Price"
                        value={line.unitPrice}
                        onChange={e => updateLine(i, "unitPrice", Number(e.target.value))}
                      />
                      <button type="button" onClick={() => removeLine(i)} disabled={form.lineItems.length === 1}
                        className="col-span-1 flex justify-center text-red-400 hover:text-red-600 disabled:opacity-30">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax, Discount, Due Date */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tax Rate (%)</label>
                  <input type="number" min={0} max={100} value={form.taxRate}
                    onChange={e => setForm(f => ({ ...f, taxRate: Number(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Discount (₹)</label>
                  <input type="number" min={0} value={form.discount}
                    onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Due Date</label>
                  <input type="date" value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Notes</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Payment instructions, thank you message…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-none" />
              </div>

              {/* Totals Preview */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 space-y-2">
                <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-slate-600"><span>Tax ({form.taxRate}%)</span><span className="font-semibold">₹{taxAmt.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-slate-600"><span>Discount</span><span className="font-semibold text-red-500">-₹{form.discount.toFixed(2)}</span></div>
                <div className="border-t border-indigo-200 pt-2 flex justify-between font-black text-slate-800 text-lg"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md disabled:opacity-60 active:scale-[0.98]">
                {submitting ? "Sending Invoice…" : "Send Invoice to Client"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── View Invoice Modal ── */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="font-black text-slate-800">{viewInvoice.invoiceNumber}</h2>
              <button onClick={() => setViewInvoice(null)} className="p-2 rounded-xl hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bill To</p>
                  <p className="font-bold text-slate-800">{viewInvoice.client?.name}</p>
                  <p className="text-sm text-slate-500">{viewInvoice.client?.email}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${STATUS_COLOR[viewInvoice.status]}`}>{viewInvoice.status}</span>
                  {viewInvoice.dueDate && <p className="text-xs text-slate-400 mt-1">Due: {new Date(viewInvoice.dueDate).toLocaleDateString()}</p>}
                </div>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b"><tr className="text-left">
                    <th className="px-4 py-2.5 font-bold text-slate-600">Description</th>
                    <th className="px-3 py-2.5 font-bold text-slate-600 text-center">Qty</th>
                    <th className="px-3 py-2.5 font-bold text-slate-600 text-right">Price</th>
                    <th className="px-4 py-2.5 font-bold text-slate-600 text-right">Amount</th>
                  </tr></thead>
                  <tbody>{viewInvoice.lineItems.map((l, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-4 py-2.5 text-slate-700">{l.description}</td>
                      <td className="px-3 py-2.5 text-center text-slate-600">{l.quantity}</td>
                      <td className="px-3 py-2.5 text-right text-slate-600">₹{l.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-800">₹{(l.quantity * l.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{viewInvoice.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Tax ({viewInvoice.taxRate}%)</span><span>₹{viewInvoice.taxAmount.toFixed(2)}</span></div>
                {viewInvoice.discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span>-₹{viewInvoice.discount.toFixed(2)}</span></div>}
                <div className="border-t pt-2 flex justify-between font-black text-slate-800 text-lg"><span>Total</span><span>₹{viewInvoice.total.toFixed(2)}</span></div>
              </div>
              {viewInvoice.notes && <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-sm text-amber-700">{viewInvoice.notes}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
