import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { devUrl } from './utils';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        // apiKey: '',
    });
    const nagivate = useNavigate();
    const [responseData, setResponseData] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    useEffect(() => {
        if (responseData?.success) {
            toast.success(responseData?.message);
            localStorage.setItem('user', JSON.stringify(responseData?.data));
            if (responseData?.data?.api_key) {
                nagivate('/')
            }
        }
        if (responseData?.success === false) {
            toast.error(responseData?.message)
        }

    }, [responseData])

    const login = async (formData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResponseData(data);
            if (response.ok) {
                // Registration successful
                console.log('Registration successful');
            } else {
                // Registration failed
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation


        if (!formData.email) {
            toast.error("Email is required");
            return
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        ) {
            toast.error("Invalid email address");
            return
        }

        if (!formData.password) {
            toast.error('Password is required');
            return;
        }

        if (formData.email || formData.password) {
            const body = {
                email: formData?.email,
                password: formData?.password
            }
            login(body)

        }


    };

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-slate-800 rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-gray-400 underline">
                    Login in
                </h1>
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-400"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full px-4 py-2 mt-2 text-gray-900 bg-gray-400 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-400"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full px-4 py-2 mt-2 text-gray-900 bg-gray-400 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <div className="mt-6 mb-10">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                        >
                            Login
                        </button>
                    </div>
                </form>
                {/* <p className="mt-8 text-xs font-light text-center text-gray-400">
                    {" "}
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="font-medium text-purple-600 hover:underline"
                    >
                        Register
                    </a>
                </p> */}
            </div>
        </div>
    );
}