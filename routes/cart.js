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
    const customers = loadFromJson("data/customers.json");
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

    if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ error: "quantity must be an integer greater than 0" });
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
    

    const product = products.find(product => product.id === id);

    if(!product){
        return res.status(404).json({error:  "Product not found"});
    }

    if(product.stock === 0){
        return res.status(400).json({error : `${product.name} out of stock`});
    }


    const existingItem = customer.cart.find(item => item.productId === id);

    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + qty;

    if (newQuantity > product.stock) {
        return res.status(400).json({error : `low stock of ${product.name},  only ${product.stock} items left`});
    }

    
    if (existingItem) {
        existingItem.quantity = newQuantity;
    } else {
        const item = {
            productId: id,
            quantity: qty
    };

    customer.cart.push(item);
    }
    
    saveToJson("data/customers.json", customers);
    

    res.status(201).json({
        success : "Item added successfully to customer's cart",
    cart: customer.cart
    });
});

router.delete("/items/:productId", (req, res) => {
    const customers = loadFromJson("data/customers.json");
    
    const {productId} = req.params;
    const {customerId} = req.body;

    
    if(!customerId){
        return res.status(400).json({error : "must recieve customerId value"});
    }

    const id = Number(productId);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "productId must be a positive number" });
    }

    const customer = customers.find(customer => customer.customerId === customerId);

    if(!customer){
        return res.status(404).json({error : "customer not found"})
    }

    const productIndex = customer.cart.findIndex(product => product.productId === id);
    
    if (productIndex === -1) {
        return res.status(404).json({
            error: "Product not found in cart"
        });
    }

    customer.cart.splice(productIndex, 1);

    saveToJson("data/customers.json", customers);

    res.status(204).end();

});

export default router;