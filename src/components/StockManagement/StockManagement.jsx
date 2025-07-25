import axios from 'axios';
import React, { useEffect, useState } from 'react';

const StockManagement = () => {
  const [currentView, setCurrentView] = useState(true);
  const [stock, setStock] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [stockType,setStockType]=useState("");
  const [newstock,newsetStock]=useState(0);

const updateStock = async (id) => {
  const accessToken = localStorage.getItem("access_token");
  const stockdata = {
    stock: newstock,
    stockType : stockType
  };

  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/update_stock/${id}/`,
      stockdata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data) {
      setStockType("");
      fetchStock(); 
      setCurrentView(true);
      setEditingId(null); 
    }
  } catch (error) {
    console.error("Error updating stock:", error?.response?.data || error.message);
    alert("Failed to update stock.");
  }
};




  const fetchStock = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.get("http://127.0.0.1:8000/get_stocks/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
//  console.log("jj",stockType);
  useEffect(() => {
    fetchStock();
  }, []);

  const totalStock = products.reduce((sum, item) => sum + parseFloat(item.stock), 0);
  const stockOutItems = products.filter(item => parseFloat(item.stock) === 0).length;

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between gap-4 mb-6">
   
     
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Product ID</th>
              <th className="p-3 border">Product Code</th>
              <th className="p-3 border">Product Name</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Current Stock</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.product.ProductID} className="hover:bg-gray-50">
                <td className="p-3 border">{item.product.ProductID}</td>
                <td className="p-3 border">{item.product.ProductCode}</td>
                <td className="p-3 border">{item.product.ProductName}</td>
                <td className="p-3 border">
                  <img 
                    src={`http://127.0.0.1:8000${item.product.ProductImage}`} 
                    className="h-22 w-22 rounded-full object-cover" 
                    alt="Product" 
                  />
                </td>
                <td className="p-3 border">{parseFloat(item.stock)}</td>
                <td className="p-3 border">
                  {editingId === item.id ? (
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={newstock}
                        onChange={(e) => newsetStock(e.target.value)} 
                        placeholder="Enter stock" 
                        className="border p-1 w-20"
                      />
                      <button 
                        onClick={() => updateStock(item.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => {
                          setCurrentView(true);
                          setEditingId(null);
                        }}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                  <div className='flex gap-3'>
                    <button 
                      onClick={() => {
                        setCurrentView(false);
                        setEditingId(item.id);
                        setStock(item.stock);
                        setStockType("IN");

                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Stock
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentView(false);
                        setEditingId(item.id);
                        setStock(item.stock);
                        setStockType("OUT");
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Remove Stock
                    </button>
                  </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;

