import dotenv from 'dotenv';
import express from "express"

dotenv.config()

const app = express();



app.get("/", (req, res) => {
    res.end("Welcome to the Book store!");
});
 
app.get("/health", (req, res) => {
    res.json({health : "Server is running"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running http://localhost:${PORT}`));
