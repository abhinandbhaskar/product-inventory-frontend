import axios from 'axios';
import React, { useEffect, useState } from 'react';
import VariantsSection from '../VariantsSection/VariantsSection';
import AddProductSection from '../AddProductSection/AddProductSection';
import ProductList from '../ProductList/ProductList';
import StockManagement from '../StockManagement/StockManagement';
import StockReport from '../StockReport/StockReport';
const DashboardSection = () => {
    const [currentView,setCurrentView]=useState("dashboard");
    const [allTransactions, setAllTransactions] = useState([]);
    const [totalProducts,setTotalProducts]=useState(0);
    const [totalStock, setTotalStock] = useState(0);
    const [stockin,setStockIn]=useState(0);
    const [stockout,setStockOut]=useState(0);



    const fetchStockReport = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.get("http://127.0.0.1:8000/get_stock_reports/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
       console.log(response);
      if (response.data) {
       
        setAllTransactions(response.data.data);
        setTotalProducts(response.data.total_products);
        setTotalStock(response.data.totalstocks);
        setStockIn(response.data.todaystockin);
        setStockOut(response.data.todaystockout);
    
        
      }
    } catch (error) {
      console.error("Error fetching stock reports:", error);
    } finally {
      // setLoading(false);
      console.log("kk");
    }
  };

    useEffect(() => {
      fetchStockReport();
    },[]);

      const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden w-full bg-gray-100">
     
      <div className="w-64 bg-white shadow-md p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Menu</h2>
        <nav className="flex flex-col space-y-2">
            <button onClick={()=>setCurrentView("dashboard")} className="text-left px-4 py-2 rounded-md hover:bg-blue-100 transition text-gray-700 font-medium">Dashboard
            </button>
            <button  onClick={()=>setCurrentView("addvariant")} className="text-left px-4 py-2 rounded-md hover:bg-blue-100 transition text-gray-700 font-medium">Add Variants
            </button>
            <button  onClick={()=>setCurrentView("addproduct")} className="text-left px-4 py-2 rounded-md hover:bg-blue-100 transition text-gray-700 font-medium">Add Products
            </button>
            <button onClick={()=>setCurrentView("productlist")} className="text-left px-4 py-2 rounded-md hover:bg-blue-100 transition text-gray-700 font-medium">Product List
            </button>
            <button  onClick={()=>setCurrentView("stockmanagement")} className="text-left px-4 py-2 rounded-md hover:bg-blue-100 transition text-gray-700 font-medium">Stock Management
            </button>
            <button  onClick={()=>setCurrentView("stockreport")} className="text-left px-4 py-2 rounded-md hover:bg-blue-100 transition text-gray-700 font-medium">Stock Reports
            </button>   
        </nav>
      </div>

     
{currentView==="dashboard" && (
          <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Stock</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{totalStock}</p>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Stock In Today</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">{stockin}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Stock Out Today</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">{stockout}</p>
          </div>
        </div>

    
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Stock Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>

                {
                  allTransactions.map((tx, index)=>(
                  <tr className="border-b">
                  <td className="px-4 py-2">{formatDate(tx.date)}</td>
                  <td className="px-4 py-2">{tx.product_variant.product.ProductName}</td>
                  <td className={`px-4 py-2 border ${tx.transaction_type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.transaction_type}
                    </td>
                  <td className="px-4 py-2">{parseFloat(tx.quantity).toFixed(2)}</td>
                </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
)}
{currentView==="addvariant" && (
    <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Variants</h1>
        <VariantsSection/>
      </div>
)}

{currentView==="addproduct" && (
    <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h1>
        <AddProductSection/>
      </div>
)}

{currentView==="productlist" && (
    <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Product List</h1>
        <ProductList/>
      </div>
)}

{currentView==="stockmanagement" && (
    <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Stock Management</h1>
        <StockManagement/>
      </div>
)}

{currentView==="stockreport" && (
    <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Stock Report</h1>
        <StockReport/>
      </div>
)}

      
    </div>
  );
};

export default DashboardSection;

