import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
const navigate=useNavigate();
const handleLogout = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://127.0.0.1:8000/adminlogout/", {}, {
      withCredentials: true
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    if (response.status === 200) {

      navigate("/");
    }
  } catch (error) {
    console.log("Error", error);
  } finally {
    console.log("completed");
  }
};

  return (
    <div className='h-[60px] w-full bg-gray-700 flex justify-between items-center'>
        <h1 className='text-white text-3xl font-bold font-sans items-center justify-center px-6'>InvenTrack</h1>
        <button onClick={handleLogout} className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-amber-100 mx-4 rounded-lg border-1 border-blue-400' >Logout</button>
    </div>
  )
}

export default Header
