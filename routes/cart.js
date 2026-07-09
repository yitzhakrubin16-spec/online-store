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

router.post("/items", (req, res) => {
    let customers = loadFromJson("data/customers.json");
    const products = loadFromJson("data/products.json");
    
    const {customerId, productId, quantity} = req.body;

    if(!customerId){
        return res.status(400).json({error : "must recieve customerId value"});
    }
    
    if(productId === undefined){
        return res.status(400).json({error : "must recieve productId value"});
    }
    
    if(quantity === undefined){
        return res.status(400).json({error : "must recieve quantity value"});
    }

    const id = Number(productId);
    const qty = Number(quantity);
    
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "productId must be a positive number" });
    }

    if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({ error: "quantity must be greater than 0" });
    }

    let customer = customers.find(customer => customer.customerId === customerId);

    if(!customer){
        customer = {
            customerId : customerId,
            balance : Number(process.env.STARTING_BALANCE),
            cart : [],
            createdAt : new Date().toISOString()
        };
        customers.push(customer);
    }
    

    let product = products.find(product => product.id === id);

    if(!product){
        return res.status(404).json({error:  "Product not found"});
    }

    if(!product.stock){
        return res.status(400).json({error : `${product.name} out of stock`});
    }

    if(qty > product.stock){
        return res.status(400).json({error : `low stock of ${product.name},  only ${product.stock} items left`});
    }

    product.stock -= qty;

    const existingItem = customer.cart.find(item => item.productId === id);

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        const item = {
            productId: id,
            quantity: qty
    };

    customer.cart.push(item);
    }
    
    saveToJson("data/customers.json", customers);
    saveToJson("data/products.json", products);

    res.status(201).json({success : "Item added successfully to customer's cart"})

});

export default router;