import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
    try {
        const { address, city, state, zip, country, lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ error: "Location required" });
        }

        const newAddress = new Address({
            user: req.user.id,
            address,
            city,
            state,
            zip,
            country,
            location: {
                type: "Point",
                coordinates: [lng, lat],
            },
        });

        await newAddress.save();

        res.status(201).json(newAddress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMyAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id });
        res.json({ addresses });
    }

    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export const deleteAddress=async(req,res)=>{
    try{
        const{id}=req.params;
        const address=await Address.findById(id);
        if(!address){
            return res.status(404).json({error:"Address not found"});
        }
        if(address.user.toString()!==req.user.id){
            return res.status(403).json({msg:"Address not found"});

        }
        await address.deleteOne();
        res.json({msg:"Address deleted"});

    }catch(err){
        res.status(500).json({error:err.message});
    }   
};