## Product Inventory System – Frontend (React.js)

This is the **frontend** part of the full-stack Product Inventory System built using **React.js**.  
It communicates with the Django REST API to manage products, stock, and transaction reports.

---

## Features

### Product Management
- Create a new product with dynamic variants and sub-variants
- Real-time form validation and structured JSON data submission

### Product Listing
- Displays all available products and their variant combinations
- Shows stock availability per variant

###  Stock Management
- Add stock (purchase) or remove stock (sale) for specific variants
- Validations to avoid overselling or negative stock

### Stock Reports
- View all stock in/out transactions
- Filter transactions using a date range
- Displays quantity, product, variant, date, and transaction type

### UI/UX
- Clean, responsive layout (Tailwind CSS)
- User-friendly forms and buttons

---

## 🛠️ Tech Stack

| Purpose     | Tech         |
|-------------|--------------|
| Frontend    | React.js     |
| HTTP Client | Axios        |
| Styling     | Tailwind CSS |
| Auth        | JWT Token auth |

---


## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/abhinandbhaskar/product-inventory-frontend.git
cd product-inventory-frontend
cd tailwindcss4

### 2. Install Dependencies

npm install

### 3. Run the Frontend Dev Server

npm run dev
Default frontend runs at:
🖥️ http://localhost:5173/

Default backend runs at:

http://127.0.0.1:8000/


### Credits & References
React.js Documentation
Axios
Tailwind CSS
ChatGPT – used for assistance

