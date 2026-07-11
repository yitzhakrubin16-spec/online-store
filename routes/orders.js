import express from "express";

import {
    loadFromJson,
    saveToJson
} from "../service/jsonService.js";

const router = express.Router();

router.post("/checkout", (req, res) => {
    const customers = loadFromJson("data/customers.json");
    const products = loadFromJson("data/products.json");
    const orders = loadFromJson("data/orders.json") || [];

    const {customerId} = req.body;

    if(!customerId){
        return res.status(400).json({error : "must recieve customerId value"});
    }

    const customer = customers.find(customer => customer.customerId === customerId);

    if(!customer){
        return res.status(404).json({error : "customer not found"});
    }

    if(!customer.cart.length){
        return res.status(400).json({error : "customer's cart is empty"});
    }
    let items = []
    let subtotal = 0;

    for (const item of customer.cart){
        const itemFromStock = products.find(product => product.id === item.productId);

        if (!itemFromStock) {
            return res.status(400).json({error: "Product in cart no longer exists"});
        }
        if (itemFromStock.stock < item.quantity){
            return res.status(400).json({error : `${itemFromStock.name} stock is too low for this purchase`});
        }

        subtotal += item.quantity * itemFromStock.price;
        
        const finalItem = {
            item : itemFromStock.name,
            quantity : item.quantity,
            price : item.quantity * itemFromStock.price
        };

        items.push(finalItem);
    }

    if(customer.balance < subtotal){
        return res.status(400).json({error : "customer's balance too low for this purchase"});
    }
    
    for (const item of customer.cart) {
        const product = products.find(product => product.id === item.productId);

        product.stock -= item.quantity;
    }

    customer.balance -= subtotal;

    const orderId = orders.length + 1;

    const order = {
        id: orderId,
        customerId : customerId,
        items : items,
        total : subtotal,
        createdAt : new Date().toISOString()
    };
    orders.push(order);

    customer.cart = [];

    saveToJson("data/customers.json", customers);
    saveToJson("data/orders.json", orders);
    saveToJson("data/products.json", products);

    return res.status(200).json({
        success: true,
        data: order
    });
});


router.get("/", (req, res) => {
    const {customerId} = req.query;

    if(!customerId){
        return res.status(400).json({error : "must recieve customerId value"})
    }

    const orders = loadFromJson("data/orders.json");

    const ordersToShow = orders.filter(order => order.customerId === customerId);
    
    res.status(200).json({
        "success" : true,
        "data" : ordersToShow
    });
});

export default router;