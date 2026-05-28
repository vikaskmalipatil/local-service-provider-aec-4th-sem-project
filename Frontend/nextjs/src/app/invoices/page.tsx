"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowLeft, X, Printer } from "lucide-react";

const API = "http://localhost:5000/api";

type LineItem = { description: string; quantity: number; unitPrice: number };
type Invoice = {
  _id: string; invoiceNumber: string; status: string; total: number; subtotal: number;
  taxRate: number; taxAmount: number; discount: number; notes: string; dueDate: string;
  createdAt: string;
  provider: { name: string; email: string; phone: string; specialty: string };
  serviceRequest: { serviceType: string; customServiceType: string; details: string; address: string };
  lineItems: LineItem[];
};

const STATUS_COLOR: Record<string, string> = {
  Sent:      "bg-blue-50 text-blue-700 border-blue-200",
  Paid:      "bg-green-50 text-green-700 border-green-200",
  Draft:     "bg-gray-50 text-gray-600 border-gray-200",
  Overdue:   "bg-red-50 text-red-700 border-red-200",
  Cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_ICON: Record<string, string> = {
  Sent: "📬", Paid: "✅", Draft: "📝", Overdue: "⚠️", Cancelled: "❌"
};

export default function ClientInvoicesPage() {
  const router = useRouter();
  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    fetch(`${API}/invoices/client`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setInvoices(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = (inv: Invoice) => {
    const printWin = window.open("", "_blank", "width=800,height=600");
    if (!printWin) return;
    printWin.document.write(`
      <html><head><title>${inv.invoiceNumber}</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1e293b;max-width:700px;margin:auto}
        h1{font-size:28px;font-weight:900;color:#4f46e5;margin:0} h2{font-size:14px;color:#64748b;margin:4px 0 0}
        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}
        .badge{padding:4px 12px;border-radius:8px;font-size:12px;font-weight:700;background:#e0e7ff;color:#4338ca}
        .section{margin-bottom:24px} .label{font-size:11px;font-weight:700;text-transform:uppercase;color:#94a3b8;margin-bottom:4px}
        .value{font-size:14px;font-weight:600} table{width:100%;border-collapse:collapse;margin-top:8px}
        th{text-align:left;padding:10px 12px;background:#f8fafc;font-size:12px;font-weight:700;color:#64748b;border-bottom:2px solid #e2e8f0}
        td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:14px}
        .text-right{text-align:right} .total-row{font-weight:700;font-size:16px;border-top:2px solid #4f46e5;color:#4f46e5}
        .notes{background:#fefce8;padding:16px;border-radius:8px;border:1px solid #fef08a;margin-top:24px;font-size:13px}
        .footer{text-align:center;margin-top:40px;color:#94a3b8;font-size:12px}
      </style></head><body>
      <div class="header">
        <div><h1>LocalFinder</h1><h2>Invoice</h2></div>
        <div style="text-align:right">
          <div style="font-size:22px;font-weight:900">${inv.invoiceNumber}</div>
          <div class="badge">${inv.status}</div>
          <div style="font-size:12px;color:#94a3b8;margin-top:4px">${new Date(inv.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>
          ${inv.dueDate ? `<div style="font-size:12px;color:#ef4444">Due: ${new Date(inv.dueDate).toLocaleDateString()}</div>` : ""}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:24px">
        <div class="section"><div class="label">From</div>
          <div class="value">${inv.provider?.name}</div>
          <div style="color:#64748b;font-size:13px">${inv.provider?.specialty}</div>
          <div style="color:#64748b;font-size:13px">${inv.provider?.email}</div>
          ${inv.provider?.phone ? `<div style="color:#64748b;font-size:13px">${inv.provider?.phone}</div>` : ""}
        </div>
        <div class="section"><div class="label">Service</div>
          <div class="value">${inv.serviceRequest?.serviceType === "Other" ? inv.serviceRequest?.customServiceType : inv.serviceRequest?.serviceType}</div>
          ${inv.serviceRequest?.address ? `<div style="color:#64748b;font-size:13px">📍 ${inv.serviceRequest?.address}</div>` : ""}
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th class="text-right">Qty</th><th class="text-right">Unit Price</th><th class="text-right">Amount</th></tr></thead>
        <tbody>
          ${inv.lineItems.map(l => `<tr><td>${l.description}</td><td class="text-right">${l.quantity}</td><td class="text-right">₹${l.unitPrice.toFixed(2)}</td><td class="text-right">₹${(l.quantity * l.unitPrice).toFixed(2)}</td></tr>`).join("")}
          <tr><td colspan="3" class="text-right" style="padding-top:12px;color:#64748b">Subtotal</td><td class="text-right" style="padding-top:12px">₹${inv.subtotal.toFixed(2)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:#64748b">Tax (${inv.taxRate}%)</td><td class="text-right">₹${inv.taxAmount.toFixed(2)}</td></tr>
          ${inv.discount > 0 ? `<tr><td colspan="3" class="text-right" style="color:#ef4444">Discount</td><td class="text-right" style="color:#ef4444">-₹${inv.discount.toFixed(2)}</td></tr>` : ""}
          <tr class="total-row"><td colspan="3" class="text-right">Total</td><td class="text-right">₹${inv.total.toFixed(2)}</td></tr>
        </tbody>
      </table>
      ${inv.notes ? `<div class="notes"><strong>Note:</strong> ${inv.notes}</div>` : ""}
      <div class="footer">Thank you for choosing LocalFinder · Generated ${new Date().toLocaleDateString()}</div>
      </body></html>`);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 500);
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
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
            <ArrowLeft size={18} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-slate-800">My Invoices</h1>
            <p className="text-xs text-slate-500">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""} received</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {invoices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
            <FileText size={52} className="mx-auto text-slate-200 mb-4" />
            <p className="font-bold text-xl text-slate-600">No invoices yet</p>
            <p className="text-sm text-slate-400 mt-2">Invoices from your service providers will appear here once a job is completed.</p>
            <Link href="/request-service" className="inline-block mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              Book a Service
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {invoices.map(inv => (
              <div key={inv._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 p-6 relative overflow-hidden group">
                {/* Decorative gradient strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl" />

                <div className="flex items-start justify-between mb-4 mt-2">
                  <div>
                    <p className="font-black text-slate-800">{inv.invoiceNumber}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-bold ${STATUS_COLOR[inv.status]}`}>
                    {STATUS_ICON[inv.status]} {inv.status}
                  </span>
                </div>

                {/* Provider info */}
                <div className="bg-slate-50/70 rounded-xl p-3 mb-4 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">From</p>
                  <p className="font-semibold text-slate-800 text-sm">{inv.provider?.name}</p>
                  <p className="text-xs text-slate-500">{inv.provider?.specialty} · {inv.provider?.email}</p>
                </div>

                {/* Service */}
                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-1">Service</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {inv.serviceRequest?.serviceType === "Other" ? inv.serviceRequest?.customServiceType : inv.serviceRequest?.serviceType}
                  </p>
                </div>

                {/* Due date */}
                {inv.dueDate && (
                  <p className="text-xs text-amber-600 font-medium mb-3">
                    📅 Due: {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-800">₹{inv.total.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="px-3 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handlePrint(inv)}
                      className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                      title="Print Invoice"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── View Invoice Modal ── */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Invoice header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-3xl px-6 py-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-indigo-200 text-sm font-medium mb-1">LocalFinder · Invoice</p>
                  <h2 className="text-2xl font-black">{viewInvoice.invoiceNumber}</h2>
                  <p className="text-indigo-200 text-sm mt-1">{new Date(viewInvoice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePrint(viewInvoice)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                    <Printer size={18} />
                  </button>
                  <button onClick={() => setViewInvoice(null)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* From / Service */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5">From</p>
                  <p className="font-bold text-slate-800">{viewInvoice.provider?.name}</p>
                  <p className="text-sm text-indigo-600">{viewInvoice.provider?.specialty}</p>
                  <p className="text-xs text-slate-500">{viewInvoice.provider?.email}</p>
                  {viewInvoice.provider?.phone && <p className="text-xs text-slate-500">{viewInvoice.provider?.phone}</p>}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5">Service</p>
                  <p className="font-bold text-slate-800">
                    {viewInvoice.serviceRequest?.serviceType === "Other" ? viewInvoice.serviceRequest?.customServiceType : viewInvoice.serviceRequest?.serviceType}
                  </p>
                  {viewInvoice.serviceRequest?.address && <p className="text-xs text-slate-500 mt-1">📍 {viewInvoice.serviceRequest?.address}</p>}
                  {viewInvoice.dueDate && <p className="text-xs text-amber-600 mt-1">Due: {new Date(viewInvoice.dueDate).toLocaleDateString()}</p>}
                </div>
              </div>

              {/* Status */}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-bold ${STATUS_COLOR[viewInvoice.status]}`}>
                {STATUS_ICON[viewInvoice.status]} {viewInvoice.status}
              </span>

              {/* Line items */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Description</th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-slate-500 uppercase">Qty</th>
                      <th className="px-3 py-3 text-right text-xs font-bold text-slate-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.lineItems.map((l, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="px-4 py-3 text-slate-700">{l.description}</td>
                        <td className="px-3 py-3 text-center text-slate-600">{l.quantity}</td>
                        <td className="px-3 py-3 text-right text-slate-600">₹{l.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">₹{(l.quantity * l.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>₹{viewInvoice.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-slate-500"><span>Tax ({viewInvoice.taxRate}%)</span><span>₹{viewInvoice.taxAmount.toFixed(2)}</span></div>
                {viewInvoice.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-500"><span>Discount</span><span>-₹{viewInvoice.discount.toFixed(2)}</span></div>
                )}
                <div className="border-t border-slate-200 pt-2.5 flex justify-between font-black text-slate-800 text-xl">
                  <span>Total</span><span className="text-indigo-600">₹{viewInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {viewInvoice.notes && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-sm text-amber-800">
                  <p className="font-bold text-xs uppercase tracking-wider text-amber-600 mb-1">Note</p>
                  {viewInvoice.notes}
                </div>
              )}

              <p className="text-center text-xs text-slate-400">Thank you for choosing LocalFinder 🙏</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
