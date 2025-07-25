import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");

  const navigate=useNavigate();

  const handleClick=async(e)=>{
     e.preventDefault(); 

    const formdata={
      "username":username.trim(),
      "password":password.trim()
    }
    console.log("Get",formdata);

    try{

      const response = await axios.post("http://127.0.0.1:8000/adminlogin/",formdata,{
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })

      const { access, refresh } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
      if(response)
      {
        navigate("/home");
      }

    }catch(error)
    {
      console.log("Error",error);
    }finally{
      console.log("Completed..");
    }


  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className=" w-[400px] p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleClick}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              id="email"
              placeholder="Enter your email"
              name="username"
              onChange={(e)=>setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

