import express from "express";

import {
    loadFromJson
} from "../service/jsonService.js";

const router = express.Router();

router.get("/balance", (req, res) => {
    const customers = loadFromJson("data/customers.json");

    const {customerId} = req.query;

    if(!customerId){
        return res.status(400).json({error : "must recieve customerId value"})
    }

    const customer = customers.find(customer => customer.customerId === customerId);

    if(!customer){
        return res.status(404).json({error : "Customer not found"});
    }
    
    res.json({balance : customer.balance});

});

export default router;