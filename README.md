# Online Store API

A simple backend API for an online bookstore built with Node.js and Express.

The API manages products, customer carts, balances, and orders using JSON files for data storage.

## Installation

Clone the repository:

```bash
git clone https://github.com/yitzhakrubin16-spec/online-store.git
```

Enter the project directory:

```bash
cd online-store
```

Install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
DB_BASE_PATH=./data
STARTING_BALANCE=500
```

## Run the Server

Start the server with:

```bash
npm start
```

The server will run on:

```text
http://localhost:3000
```

## API Endpoints

### General

#### GET /

Returns a welcome message.

```text
GET /
```

#### GET /health

Checks that the server is running.

```text
GET /health
```

---

## Products

### GET /products

Returns the product list.

```text
GET /products
```

Supported query parameters:

- `inStock` - Filter products by stock availability.
- `maxPrice` - Return products with a price less than or equal to the given value.
- `search` - Search for text inside the product name.

Example:

```text
GET /products?inStock=true&maxPrice=50&search=harry
```

---

## Cart

### GET /cart

Returns the cart of a specific customer.

The `customerId` must be provided as a query parameter.

Example:

```text
GET /cart?customerId=abc123
```

### POST /cart/items

Adds a product to a customer's cart.

If the customer does not exist, a new customer is automatically created with the starting balance defined in the `.env` file.

If the product already exists in the cart, its quantity is updated.

Example body:

```json
{
  "customerId": "abc123",
  "productId": 1,
  "quantity": 2
}
```

### DELETE /cart/items/:productId

Removes a product from a customer's cart.

The product ID is provided as a route parameter.

Example:

```text
DELETE /cart/items/1
```

Example body:

```json
{
  "customerId": "abc123"
}
```

---

## Account

### GET /account/balance

Returns the current balance of a customer.

The `customerId` must be provided as a query parameter.

Example:

```text
GET /account/balance?customerId=abc123
```

---

## Orders

### POST /orders/checkout

Performs checkout for a customer's cart.

The checkout process:

- Validates that the cart is not empty.
- Checks that all products still exist.
- Checks product stock.
- Calculates the total price.
- Checks the customer's balance.
- Updates product stock.
- Updates the customer's balance.
- Creates a new order.
- Clears the customer's cart.

Example body:

```json
{
  "customerId": "abc123"
}
```

### GET /orders

Returns the order history of a specific customer.

The `customerId` must be provided as a query parameter.

Example:

```text
GET /orders?customerId=abc123
```

---

## Data Storage

Application data is stored in JSON files:

```text
data/
├── products.json
├── customers.json
└── orders.json
```

The path to the data directory is configured using the `DB_BASE_PATH` environment variable.

## Technologies

- Node.js
- Express
- dotenv
- JSON file storage