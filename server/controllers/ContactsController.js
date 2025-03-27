
const User = require("../models/UserModal")

exports.searchContacts = async(req,res) => {
    try{

        const {searchTerm} = req.body;
        if(searchTerm===undefined || searchTerm === null){
            return res.status(403).json({
                success : false,
                message : "No search Term found"
            })
        }
        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
        const regex = new RegExp(sanitizedSearchTerm,"i");

        const contacts = await User.find({
            $and:[{_id:{$ne:req.userId}},
                {
                    $or :[{firstName:regex},{lastName:regex},{email:regex}]
                }
            ]
        })
        
        return res.status(200).json({
            success: true,
            message : "User found",
            contacts
        })

    }
    catch(e){

        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })

    }
}