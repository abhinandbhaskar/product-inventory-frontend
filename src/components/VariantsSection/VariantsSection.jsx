import axios from "axios";
import React, { useEffect, useState } from "react";

const VariantsSection = () => {
    const [variant, setVariant] = useState("");
    const [variantsData, setVariantsData] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState("");
    const [subVariant, setSubVariant] = useState("");
    const [subVariantsData, setSubVariantsData] = useState([]);

    const handleVariant = async (e) => {
        e.preventDefault();
        const VariantData = {
            variant: variant,
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/add_variant/", VariantData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log("Response", response.data);
            setVariant("");
            fetchVariants(); 
        } catch (error) {
            console.log("Error", error);
        }
    };

    const handleSubVariant = async (e) => {
        e.preventDefault();
        if (!selectedVariant) {
            alert("Please select a variant first");
            return;
        }

        const SubVariantData = {
            variant_id: selectedVariant,
            value: subVariant,
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/add_subvariant/", SubVariantData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log("Response", response.data);
            setSubVariant("");
            fetchSubVariants();
        } catch (error) {
            console.log("Error", error);
        }
    };

    const VariantDelete = async (id) => {
        console.log("va", id);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/delete_variant/${id}/`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log(response);
            if (response) {
                fetchVariants();
            }
        } catch (errors) {
            console.log(errors);
        }
    };

    const SubVariantDelete=async(id)=>{

              console.log("va", id);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/delete_subvariant/${id}/`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log(response);
            if (response) {
                fetchSubVariants();
            }
        } catch (errors) {
            console.log(errors);
        }

    }

    const fetchVariants = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/get_variants/", {
                withCredentials: true,
            });
            setVariantsData(response.data);
        } catch (error) {
            console.log("Error", error);
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
        fetchVariants();
        fetchSubVariants();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
            <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-xl font-bold mb-4 text-gray-800">Variants</h1>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Add Variant Name"
                        name="variant"
                        value={variant}
                        onChange={(e) => setVariant(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={handleVariant}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>

                <div className="space-y-2">
                    {variantsData.map((variant) => (
                        <div key={variant.id} className="flex justify-between items-center border-t pt-4">
                            <h3 className="text-lg font-medium text-gray-700">{variant.name}</h3>
                            <button onClick={() => VariantDelete(variant.id)} className="text-red-500 hover:underline">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sub Variants Section */}
            <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-xl font-bold mb-4 text-gray-800">Sub Variants</h1>

                <div className="mb-4">
                    <select
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Variant</option>
                        {variantsData.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                                {variant.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Add Sub Variant Name"
                        value={subVariant}
                        onChange={(e) => setSubVariant(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={handleSubVariant}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>

                <div className="space-y-2">
                    {subVariantsData.map((variant) => (
                        <div key={variant.id} className="border-t pt-4 flex justify-between">
                            <h3 className="text-lg font-medium text-gray-700">{variant.variant_name}</h3>
                            <h4 className="text-gray-600">{variant.value}</h4>
                                    <div key={variant.id} className="flex justify-between items-center mt-2">
                                        
                                        <button onClick={()=>SubVariantDelete(variant.id)} className="text-red-500 hover:underline">Delete</button>
                                    </div>           
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VariantsSection;
