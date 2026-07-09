import express from "express";

import {
    loadFromJson,
    saveToJson
} from "../service/jsonService.js";
import { error } from "node:console";

const router = express.Router();


router.get("/", (req, res) => {
    const customers = loadFromJson("data/customers.json");

    const {customerId} = req.query;

    if(!customerId){
        return res.status(400).json({error : "must recieve customerId value"})
    }

    const customer = customers.find(customer => customer.customerId === customerId);

    if(!customer){
        return res.status(404).json({error : "Customer not found"});
    }
    
    res.json(customer.cart);
});



export default router;