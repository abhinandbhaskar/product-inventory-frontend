import axios from "axios";
import React, { useEffect, useState } from "react";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10); 

    const fetchProductLists = async (page = 1, size = pageSize) => {
        const accessToken = localStorage.getItem("access_token");
        try {
            const response = await axios.get("http://127.0.0.1:8000/get_productlist/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    page: page,
                    page_size: size
                }
            });
            if (response.data) {
                setProducts(response.data.results); 
                setTotalPages(response.data.total_pages || 1);
                setCurrentPage(page);
                setPageSize(size);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductLists();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchProductLists(newPage);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        fetchProductLists(1, newSize); 
    };

    if (loading) {
        return <div className="p-4">Loading products...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                {/* <h2 className="text-xl font-semibold">Product List</h2> */}
                <div className="flex items-center space-x-4">
                    <select 
                        value={pageSize} 
                        onChange={handlePageSizeChange}
                        className="border rounded px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                            <th className="p-3 border">Product ID</th>
                            <th className="p-3 border">Product Code</th>
                            <th className="p-3 border">Photo</th>
                            <th className="p-3 border">Product Name</th>
                            <th className="p-3 border">Total Stock</th>
                            <th className="p-3 border">HSN Code</th>
                            <th className="p-3 border">Variants</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product,index) => (
                                <tr key={product.ProductID} className="hover:bg-gray-50">
                                    <td className="p-3 border">{index+1}</td>
                                    <td className="p-3 border">{product.ProductCode}</td>
                                    <td className="p-3 border">
                                        <img
                                            src={`http://127.0.0.1:8000/${product.ProductImage}`}
                                            alt="product"
                                            className="h-24 w-24 object-cover rounded-lg"
                                        />
                                    </td>
                                    <td className="p-3 border">{product.ProductName}</td>
                                    <td className="p-3 border">{parseFloat(product.TotalStock).toFixed(2)}</td>
                                    <td className="p-3 border">{product.HSNCode}</td>
                                    <td className="p-3 border">
                                        {product.variants?.map((variant, i) => (
                                            <div key={i}>
                                                <strong>{variant.name}:</strong>
                                                <ul className="list-disc list-inside">
                                                    {variant.options.map((option, j) => (
                                                        <li key={j}>{option}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-gray-500">
                                    No products available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            First
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        
                      
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 border-t border-b border-gray-300 text-sm font-medium ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Last
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ProductList;