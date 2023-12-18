import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { devUrl } from '../utils';
import { useNavigate } from 'react-router-dom'
const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
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


    const register = async (formData) => {
        try {
            const response = await fetch(`${devUrl}registration`, {
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


        if (!formData.fullName) {
            toast.error("Email is required");
            return
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.fullName)
        ) {
            toast.error("Invalid email address");
            return
        }

        if (!formData.email) {
            toast.error('Password is required');
            return;
        }

        if (formData.fullName || formData.email) {
            const body = {
                email: formData?.fullName,
                password: formData?.email
            }
            register(body)
        }






    };

    return (
        <section className="text-gray-400 bg-gray-900 body-font">
            <div className="container flex flex-col justify-center lg:max-w-xl px-5 py-24 mx-auto">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 mt-10">
                    <h2 className="text-white text-lg font-medium title-font mb-5">
                        Sign Up
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="relative mb-4">
                            <label htmlFor="full-name" className="leading-7 text-sm text-gray-400">
                                Email
                            </label>
                            <input
                                type="text"
                                id="full-name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-400">
                                Password
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <button
                            type="submit"
                            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                        >
                            Register
                        </button>
                    </form>
                    <p className="mt-8 text-xs font-light text-center text-gray-400">
                        Do you have already an account?{' '}
                        <a
                            href="/login"
                            className="font-medium text-purple-600 hover:underline"
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Register;