import express from "express";

import {
    loadFromJson
} from "../service/jsonService.js";

const router = express.Router();

router.get("/", (req, res) => {
    const { inStock, maxPrice, search, ...extraParams } = req.query;
    
    if (Object.keys(extraParams).length > 0) {
    return res.status(400).json({error: "Invalid query parameter"});
    }
    
    let result = loadFromJson("data/products.json")

    if(inStock){
        if (inStock === "true"){
            result = result.filter(product => product.stock > 0);
        }else if(inStock === "false"){
            result = result.filter(product => product.stock === 0);
        }
        else{
            return res.status(400).json({error : "Invalid inStock value. Use 'true' or 'false'"})
        }
    }
    
    if(maxPrice){
        const max = Number(maxPrice);
       
        if (Number.isNaN(max)) {
        return res.status(400).json({ error: "maxPrice must be a number" });
        }

        if (max < 0){
            return res.status(400).json({error : "Invalid maxPrice value. Use positive number only"})
        }

        result = result.filter(product => product.price <= max); 
    }

    if(search){
        result = result.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
    }

    res.json(result);
});

export default router;