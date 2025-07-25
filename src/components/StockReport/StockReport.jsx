import axios from 'axios';
import React, { useEffect, useState } from 'react';

const StockReport = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [totalStock, setTotalStock] = useState(0);

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
        setFilteredTransactions(response.data.data); 
        setTotalStock(response.data.totalstocks);
        
      }
    } catch (error) {
      console.error("Error fetching stock reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setLoading(true);
    
    const filtered = allTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      
      const afterStart = !filters.startDate || new Date(filters.startDate) <= txDate;
      
      const beforeEnd = !filters.endDate || new Date(filters.endDate + 'T23:59:59') >= txDate;
      
      return afterStart && beforeEnd;
    });
    
    setFilteredTransactions(filtered);
    
    setLoading(false);
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
    });
    setFilteredTransactions(allTransactions);
  };

  useEffect(() => {
    fetchStockReport();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between mb-6 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Stock</p>
          <p className="text-xl font-bold text-blue-600">{totalStock}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <label>From:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border p-1 rounded"
            />
            <label>To:</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border p-1 rounded"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Filter
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-600 text-white px-3 py-1 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Stock Transactions</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300 rounded shadow text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Product Variant</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">User</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">{formatDate(tx.date)}</td>
                    <td className="p-2 border">{tx.product_variant.product.ProductName}</td>
                    <td className={`p-2 border ${tx.transaction_type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.transaction_type}
                    </td>
                    <td className="p-2 border">{parseFloat(tx.quantity).toFixed(2)}</td>
                    <td className="p-2 border">{tx.user.username}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No transactions found for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StockReport;