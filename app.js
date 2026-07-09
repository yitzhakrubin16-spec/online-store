import dotenv from 'dotenv';
import express from "express";
import accountRouter from "./routes/account.js"
import cartRouter from "./routes/cart.js"
import ordersRouter from "./routes/orders.js"
import productsRouter from "./routes/products.js"

dotenv.config()

const app = express();

app.use(express.json());
app.use('/account', accountRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);


app.get("/", (req, res) => {
    res.end("Welcome to the Book store!");
});
 
app.get("/health", (req, res) => {
    res.json({health : "Server is running"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running http://localhost:${PORT}`));
