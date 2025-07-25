import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProductSection = () => {
  
    const [productData, setProductData] = useState({
        productName: "",
        productCode: "",
        hsnCode: "",
        totalStock: "",
        isFavourite: false,
        active: true,
        image: null,
        imagePreview: null,
    });

    const [availableVariants, setAvailableVariants] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState([]);
    const [variantOptions, setVariantOptions] = useState({});
    const [variantStocks, setVariantStocks] = useState({});
    const [combinationCodes, setCombinationCodes] = useState({});
    const [loading, setLoading] = useState(false);
    const [productId, setProductId] = useState(null);
    const [subVariantsData, setSubVariantsData] = useState([]);

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/get_variants/", {
                    withCredentials: true,
                });
                setAvailableVariants(response.data);
            } catch (error) {
                console.error("Error fetching variants:", error);
            }
        };
        fetchVariants();
    }, []);

    const handleProductChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData({
            ...productData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductData({
                    ...productData,
                    image: file,
                    imagePreview: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVariantSelection = (variant) => {
        if (selectedVariants.some((v) => v.id === variant.id)) {
            setSelectedVariants((prev) => prev.filter((v) => v.id !== variant.id));

            setVariantOptions((prev) => {
                const newOptions = { ...prev };
                delete newOptions[variant.id];
                return newOptions;
            });
            setVariantStocks((prev) => {
                const newStocks = { ...prev };
                delete newStocks[variant.id];
                return newStocks;
            });
            setCombinationCodes((prev) => {
                const newCodes = { ...prev };
                delete newCodes[variant.id];
                return newCodes;
            });
        } else {
            setSelectedVariants((prev) => [...prev, variant]);
            setVariantOptions((prev) => ({
                ...prev,
                [variant.id]: [""],
            }));
            setVariantStocks((prev) => ({
                ...prev,
                [variant.id]: [""],
            }));
            setCombinationCodes((prev) => ({
                ...prev,
                [variant.id]: [""],
            }));
        }
    };

    const handleOptionChange = (variantId, index, value) => {
        setVariantOptions((prev) => ({
            ...prev,
            [variantId]: prev[variantId].map((opt, i) => (i === index ? value : opt)),
        }));
    };

    const handleStockChange = (variantId, index, value) => {
        setVariantStocks((prev) => ({
            ...prev,
            [variantId]: prev[variantId].map((stock, i) => (i === index ? value : stock)),
        }));
    };

    const handleCodeChange = (variantId, index, value) => {
        setCombinationCodes((prev) => ({
            ...prev,
            [variantId]: prev[variantId].map((code, i) => (i === index ? value : code)),
        }));
    };

    const addOptionField = (variantId) => {
        setVariantOptions((prev) => ({
            ...prev,
            [variantId]: [...prev[variantId], ""],
        }));
        setVariantStocks((prev) => ({
            ...prev,
            [variantId]: [...prev[variantId], ""],
        }));
        setCombinationCodes((prev) => ({
            ...prev,
            [variantId]: [...prev[variantId], ""],
        }));
    };

    const removeOptionField = (variantId, index) => {
        setVariantOptions((prev) => ({
            ...prev,
            [variantId]: prev[variantId].filter((_, i) => i !== index),
        }));
        setVariantStocks((prev) => ({
            ...prev,
            [variantId]: prev[variantId].filter((_, i) => i !== index),
        }));
        setCombinationCodes((prev) => ({
            ...prev,
            [variantId]: prev[variantId].filter((_, i) => i !== index),
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("ProductName", productData.productName);
        formData.append("ProductCode", productData.productCode);
        formData.append("HSNCode", productData.hsnCode || "");
        formData.append("TotalStock", productData.totalStock || 0);
        formData.append("IsFavourite", productData.isFavourite);
        formData.append("Active", productData.active);

        if (productData.image) {
            formData.append("ProductImage", productData.image);
        }

        const accessToken = localStorage.getItem("access_token"); 

        try {
            const response = await axios.post("http://127.0.0.1:8000/add_product/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`, 
                },
            });

            setProductId(response.data.id);
            alert("Product added successfully! Now you can add variants.");
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVariantSubmit = async () => {
        if (!productId) {
            alert("Please save the product first");
            return;
        }

        try {
            for (const variant of selectedVariants) {
                await axios.post(
                    "http://127.0.0.1:8000/add_variant_mapping/",
                    {
                        product_id: productId,
                        variant_id: variant.id,
                    },
                    { withCredentials: true }
                );
            }

            for (const variant of selectedVariants) {
                const options = variantOptions[variant.id] || [];
                const stocks = variantStocks[variant.id] || [];
                const codes = combinationCodes[variant.id] || [];

                for (let i = 0; i < options.length; i++) {
                    if (options[i] && stocks[i] && codes[i]) {
                        await axios.post(
                            "http://127.0.0.1:8000/add_variant_combination/",
                            {
                                product_id: productId,
                                variant_id: variant.id,
                                option_value: options[i],
                                stock: stocks[i],
                                combination_code: codes[i],
                            },
                            { withCredentials: true }
                        );
                    }
                }
            }

            alert("Variants added successfully!");
            setProductId(null);
        } catch (error) {
            console.error("Error adding variants:", error);
            alert("Failed to add variants. Please try again.");
        }
    };

    const fetchSubVariants = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/get_subvariants/", {
                withCredentials: true,
            });
            console.log("dddd", response.data);
            setSubVariantsData(response.data);
        } catch (error) {
            console.log("Error", error);
        }
    };

    useEffect(() => {
        fetchSubVariants();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                        <input
                            type="text"
                            name="productName"
                            value={productData.productName}
                            onChange={handleProductChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Code*</label>
                        <input
                            type="text"
                            name="productCode"
                            value={productData.productCode}
                            onChange={handleProductChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                        <input
                            type="text"
                            name="hsnCode"
                            value={productData.hsnCode}
                            onChange={handleProductChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Stock</label>
                        <input
                            type="number"
                            name="totalStock"
                            value={productData.totalStock}
                            onChange={handleProductChange}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div className="flex items-center gap-4">
                        {productData.imagePreview ? (
                            <img
                                src={productData.imagePreview}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded-md"
                            />
                        ) : (
                            <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-500">No image</span>
                            </div>
                        )}
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full max-w-xs"
                        />
                    </div>
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isFavourite"
                            checked={productData.isFavourite}
                            onChange={handleProductChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Mark as Favourite</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="active"
                            checked={productData.active}
                            onChange={handleProductChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Active Product</span>
                    </label>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded-md text-white ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </form>

            {productId && (
                <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Product Variants</h3>

                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Select Variant Types:</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {availableVariants.map((variant) => (
                                <button
                                    key={variant.id}
                                    type="button"
                                    onClick={() => handleVariantSelection(variant)}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedVariants.some((v) => v.id === variant.id)
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>

                        {selectedVariants.map((variant) => (
                            <div key={variant.id} className="mb-6 p-4 border rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">{variant.name} Options</h4>

                                {(variantOptions[variant.id] || []).map((option, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Option Value</label>

                                            <select
                                                key={index}
                                                onChange={(e) => handleOptionChange(variant.id, index, e.target.value)}
                                            >
                                                <option value="">Select an option</option>
                                                {subVariantsData.map((opt, i) => (
                                                    <option key={i} value={opt.value}>
                                                        {opt.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Stock</label>
                                            <input
                                                type="number"
                                                value={variantStocks[variant.id]?.[index] || ""}
                                                onChange={(e) => handleStockChange(variant.id, index, e.target.value)}
                                                placeholder="Stock"
                                                min="0"
                                                step="0.01"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Combination Code</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={combinationCodes[variant.id]?.[index] || ""}
                                                    onChange={(e) => handleCodeChange(variant.id, index, e.target.value)}
                                                    placeholder="Code"
                                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeOptionField(variant.id, index)}
                                                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addOptionField(variant.id)}
                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                >
                                    <span className="mr-1">+</span> Add {variant.name} option
                                </button>
                            </div>
                        ))}

                        {selectedVariants.length > 0 && (
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={handleVariantSubmit}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Save Variants
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProductSection;
