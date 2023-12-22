import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { devUrl, useLocalStorage } from './utils'
import { useNavigate } from 'react-router-dom'
import image from './assets/image.png'
import Tooltip from './components/Tooltip';

const Users = () => {
    const [modelOpen, setModelOpen] = useState(false);
    const [particularItem, setParticularItem] = useState(null);
    const [users, setUsers] = useState(null);
    const [keywordValue, setKeywordValue] = useState("");
    const [error, setError] = useState('');
    const nagivate = useNavigate();
    const [defalutDateValue, setDefalutDateValue] = useState('')

    const dateFoemate = (date_time) => {
        const dateObject = new Date(date_time);

        // Extract year, month, and day components
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');

        // Create the formatted date string
        return `${year}-${month}-${day}`;
    }
    const [formData, setFormData] = useState({
        name: particularItem ? particularItem?.name : '',
        account_number: particularItem ? particularItem?.account_number : '',
        date_time: particularItem ? dateFoemate(particularItem?.date_time) : '',
        comment: particularItem ? particularItem?.comment : ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [localPage, setLocalPage] = useState(currentPage);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    const item = localStorage.getItem('user');
    const user = item ? JSON.parse(item) : '';


    const [name] = useLocalStorage('user')
    useEffect(() => {
        setLocalPage(currentPage);
    }, [currentPage]);
    const pageChange = (currentPage) => {
        setCurrentPage(currentPage);
    }
    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== localPage) {
            setLocalPage(pageNumber);
            pageChange(pageNumber);
        }
    };

    const nextPage = () => {
        if (localPage < totalPages) {
            goToPage(localPage + 1);
        }
    };

    const previousPage = () => {
        if (localPage > 1) {
            goToPage(localPage - 1);
        }
    };

    const [addResponseData, setAddResponseData] = useState(null);
    const [updateResponseData, setUpdateResponseData] = useState(null);
    const [deleteResponseData, setDeleteResponseData] = useState(null)


    const handleChange = (e) => {
        const { name, value, } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'date_time') {
            setDefalutDateValue(value)

        }
    };


    useEffect(() => {
        setDefalutDateValue(dateFoemate(particularItem?.date_time))
    }, [particularItem])
    console.log(" dafaulte Dtae", defalutDateValue)
    useEffect(() => {
        fetchUsers({ search: keywordValue, pageNumber: currentPage, pageSize: itemsPerPage });
    }, []);
    useEffect(() => {
        fetchUsers({ search: keywordValue, pageNumber: currentPage, pageSize: itemsPerPage });
    }, [keywordValue]);

    useEffect(() => {
        if (updateResponseData?.success) {
            toast.success(updateResponseData?.message)
            setModelOpen(false)
            setFormData({
                name: '',
                account_number: '',
                date_time: '',
                comment: ''
            });
            setDefalutDateValue('')
            setParticularItem(null);
            fetchUsers({ search: keywordValue, pageNumber: currentPage, pageSize: itemsPerPage });
        }
        if (updateResponseData?.success === false) {
            toast.error(updateResponseData?.message)
        }

    }, [updateResponseData])
    useEffect(() => {
        if (deleteResponseData?.success) {
            toast.success(deleteResponseData?.message)
            fetchUsers({ search: keywordValue, pageNumber: currentPage, pageSize: itemsPerPage })
        }
        if (deleteResponseData?.success === false) {
            toast.error(deleteResponseData?.message)
        }

    }, [deleteResponseData])

    useEffect(() => {
        if (addResponseData?.success) {
            toast.success(addResponseData?.message)
            setModelOpen(false)
            setFormData({
                name: '',
                account_number: '',
                date_time: '',
                comment: ''
            });
            setDefalutDateValue('')
            fetchUsers({ search: keywordValue, pageNumber: currentPage, pageSize: itemsPerPage });
        }
        if (addResponseData?.success === false) {
            toast.error(addResponseData?.message)
        }



    }, [addResponseData])

    useEffect(() => {
        setCurrentPage(1)
    }, [keywordValue])


    useEffect(() => {
        fetchUsers({ search: keywordValue, pageNumber: currentPage, pageSize: itemsPerPage })
    }, [currentPage]);

    // Fetch users from API
    const fetchUsers = async (params) => {
        try {
            const queryString = Object.keys(params)
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');

            // Append the query string to the URL
            const url = `${devUrl}users/list?${queryString}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${user?.api_key}`,
                    'ngrok-skip-browser-warning': true
                },
            });
            const data = await response.json();
            setUsers(data);
            setTotalItems(data?.totalCount);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    // Create a new user
    const addUser = async (userData) => {
        try {
            const response = await fetch(`${devUrl}user/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.api_key}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            setAddResponseData(data);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    // Update an existing user
    const updateUser = async (userData) => {
        try {
            const response = await fetch(`${devUrl}user/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.api_key}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const updatedUser = await response.json();
            setUpdateResponseData(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };


    const logout = () => {
        localStorage.clear('user')
        toast.success('logout successfully')
        nagivate('/login')
    }

    // Delete a user
    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`${devUrl}user/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.api_key}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userId),
            });
            const deleteUser = await response.json();
            setDeleteResponseData(deleteUser);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    const onDeleteClick = (item) => {
        const id = {
            user_id: item?.id
        }
        if (item?.id) {
            deleteUser(id)
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault();

        // Your form submission logic here
        if (!formData.name || !formData.account_number || !defalutDateValue || !formData?.comment) {
            setError('All fields are required');
            return;
        }
        if (isNaN(formData.account_number)) {
            setError('Account Number must be a valid integer');
            return;
        } else {
            setError('');
        }
        if (!error) {
            if (particularItem?.id) {
                const body = {
                    name: formData.name,
                    user_id: particularItem?.id,
                    account_number: formData.account_number,
                    date_time: defalutDateValue,
                    comment: formData.comment
                }
                console.log("first body update", body)
                updateUser(body)
            } else {
                const body = {
                    name: formData.name,
                    account_number: formData.account_number,
                    date_time: defalutDateValue,
                    comment: formData.comment
                }

                console.log("first body add", body)
                if (body) {
                    addUser(body)
                }

            }
        }
    };
    function formatDate(isoDateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(isoDateString).toLocaleDateString(undefined, options);
    }

    const handleEdit = (item) => {
        setModelOpen(true);
        setFormData(item);
        setParticularItem(item)
    }

    const goToSeeting = () => {
        nagivate('/setting')
    }

    return (
        <div className='min-h-full overflow-hidden'>
            <header className="text-gray-400 bg-gray-500 body-font">
                <div className="container mx-auto flex flex-wrap p-5 justify-between md:flex-row items-center">
                    <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg> */}
                        <img height={40} width={40} className='rounded-full' src={image} alt="logo" />
                        <span className="ml-3 text-xl">{name?.email}</span>
                    </a>
                    <div className='flex flex-row gap-4'>
                        <div className="text-center ">
                            <button type="button" onClick={() => { goToSeeting() }} className="px-2 py-2 font-semibold rounded bg-green-500  text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
                            </button>
                        </div>
                        <button onClick={() => { logout() }} className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">Log Out

                        </button>

                    </div>

                </div>
            </header>
            <div className='container px-5 pb-24 pt-7 mx-auto '>
                <div className="sm:flex sm:justify-between sm:items-center p-3 mb-4">

                    {/* Left: Avatars */}

                    <fieldset className="w-36 space-y-1  mb-3 text-gray-100">
                        <div className="relative text-slate-500">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <button
                                    type="button"
                                    title="search"
                                    className="p-1 focus:outline-none focus:ring"
                                >
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 512 512"
                                        className="w-4 h-4 text-gray-100"
                                    >
                                        <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                                    </svg>
                                </button>
                            </span>
                            <input
                                type="text"
                                value={keywordValue}
                                onChange={(e) => {
                                    setKeywordValue(e.target.value);
                                }}
                                placeholder="Search..."
                                className="w-36 py-2 pl-10 pr-10 text-sm rounded-md sm:w-auto focus:outline-none bg-gray-800 text-gray-100 focus:bg-gray-700 focus:border-violet-400"
                            />
                            <span
                                className={`absolute ${keywordValue ? "" : "hidden"
                                    } inset-y-0 right-0 flex items-center pr-2`}
                                onClick={() => {
                                    setKeywordValue("");
                                }}
                            >
                                <button className="p-1 focus:outline-none focus:ring">
                                    <svg
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 text-gray-100"
                                        viewBox="0 0 384 512"
                                    >
                                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                    </svg>
                                </button>
                            </span>
                        </div>
                    </fieldset>
                    <div className="flex justify-end">
                        <div onClick={() => { setModelOpen(true) }}>
                            <button type="button" className="text-white p-3 rounded bg-indigo-500  mb-4"><svg xmlns="http://www.w3.org/2000/svg" height="1.3em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg></button>
                        </div>
                    </div>
                </div>


                {modelOpen && (
                    <div className={` bg-[#000000ab] h-full w-full mb-9  flex items-center justify-center z-50 `}>
                        <div className={`flex flex-col w-full  gap-2 h-full overflow-auto shadow-md bg-gray-800 text-gray-100 `}>
                            <div className='flex justify-between px-5 py-7 bg-slate-600'>
                                <h2 className="flex items-center  text-gray-100 gap-2 text-xl font-semibold leadi tracki">
                                    {particularItem?.name ? 'Update User' : 'Add User'}
                                </h2>
                                <button onClick={() => { setModelOpen(false); setParticularItem(null); setFormData({ name: '', account_number: '', date_time: '' }); setError(''); setDefalutDateValue('') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512">
                                        <path fill='#a4a5a8' d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" />
                                    </svg>
                                </button>
                            </div>
                            {error && <div className="text-red-500 text-center mt-4 text-sm italic">{error}</div>}

                            <form className='px-5 pb-7' onSubmit={handleSubmit} autoComplete='off'>
                                <div className="relative sm:mr-4 mt-3 mr-2">
                                    <label className="leading-7 text-sm text-gray-400" htmlFor="name">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-700 bg-opacity-40 rounded border focus:bg-salte-700 border-gray-700 focus:ring-2 focus:ring-indigo-300  focus:border-indigo-500 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div className="relative sm:mr-4 mt-3 mr-2">
                                    <label className="leading-7 text-sm text-gray-400" htmlFor="account_number">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        name="account_number"
                                        id="account_number"
                                        value={formData.account_number}
                                        onChange={handleChange}
                                        className="w-full  bg-opacity-40 rounded border bg-slate-700 border-gray-700 focus:ring-2 focus:ring-indigo-300  focus:border-indigo-500 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div className="relative sm:mr-4 mt-3 mr-2">
                                    <label className="leading-7 text-sm text-gray-400" htmlFor="date_time">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date_time"
                                        id="date_time"
                                        value={defalutDateValue}
                                        onChange={handleChange}
                                        className="w-full  bg-opacity-40 rounded border bg-slate-700 border-gray-700 focus:ring-2 focus:ring-indigo-300  focus:border-indigo-500 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>
                                <div className="relative sm:mr-4 mt-3 mr-2">
                                    <label className="leading-7 text-sm text-gray-400" htmlFor="comment">
                                        Comment
                                    </label>
                                    <textarea
                                        name="comment"
                                        id="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        className="w-full  bg-opacity-40 rounded border bg-slate-700 border-gray-700 focus:ring-2 focus:ring-indigo-300  focus:border-indigo-500 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>


                                <hr className='my-6' />
                                <div className="flex flex-col justify-end gap-3 sm:flex-row">
                                    <button onClick={() => { setModelOpen(false); setParticularItem(null); setFormData({ name: '', account_number: '', date_time: '' }); setError(''); setDefalutDateValue('') }} className="px-6 py-2 border rounded-sm text-gray-50 border-gray-700">Cancel</button>
                                    <button type="submit" className="px-6 py-2 rounded-sm shadow-sm bg-indigo-500   text-gray-900">
                                        {particularItem ? 'Update' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}



                <div className="col-span-full xl:col-span-8 bg-slate-800  shadow-lg rounded-sm border border-slate-700">
                    <div className="p-3">
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full text-slate-300">
                                {/* Table header */}
                                <thead className="text-xs uppercase text-slate-200 bg-slate-700 bg-opacity-50 rounded-sm">
                                    <tr>
                                        <th className="p-2">
                                            <div className="font-semibold text-left">Name</div>
                                        </th>
                                        <th className="p-2">
                                            <div className="font-semibold text-center">Account Number</div>
                                        </th>
                                        <th className="p-2">
                                            <div className="font-semibold text-center">Date</div>
                                        </th>
                                        <th className="p-2">
                                            <div className="font-semibold text-left">Comment</div>
                                        </th>
                                        <th className="p-2">
                                            <div className="font-semibold text-center"></div>
                                        </th>
                                    </tr>
                                </thead>
                                {/* Table body */}
                                <tbody className="text-sm font-medium divide-y divide-slate-700">
                                    {/* Row */}
                                    {users?.data?.map((item) => {
                                        return (
                                            <tr key={item?.id}>
                                                <td className="p-2 whitespace-nowrap" >
                                                    <div className="flex items-center">
                                                        <div className="text-center">{item?.name}</div>
                                                    </div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center">{item?.account_number}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center text-emerald-500">{formatDate(item?.date_time)}</div>
                                                </td>
                                                <td className="p-2 " >
                                                    {item?.comment && item?.comment.length > 25 ? (
                                                        <Tooltip text={item?.comment} >
                                                            <div className="text-left text-sky-500">{item?.comment.slice(0, 25)}...</div>
                                                        </Tooltip>
                                                    ) : (
                                                        <div className="text-left text-sky-500">{item?.comment}</div>
                                                    )}
                                                </td>
                                                <td className="p-2 whitespace-nowrap flex flex-row">
                                                    <div className="text-center">
                                                        <button onClick={() => { handleEdit(item) }} className="px-2 py-2  mr-2 font-semibold rounded bg-green-500  text-white">
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill='#2a2b2c' viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg>
                                                        </button>
                                                    </div>
                                                    <div className="text-center ">
                                                        <button type="button" onClick={() => { onDeleteClick(item) }} className="px-2 py-2 font-semibold rounded bg-red-500  text-white">
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill='#2a2b2c' viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <>
                    <div className='flex justify-end'>
                        <nav aria-label="Pagination" className="inline-flex  -space-x-px rounded-md mt-3 shadow-sm bg-gray-800 text-gray-100">

                            <button onClick={previousPage} className={`inline-flex items-center ${localPage === 1 ? 'disable' : ''} px-2 py-2 text-sm font-semibold border rounded-l-md border-gray-700`}>
                                <span className="sr-only">Previous</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                            {localPage > 1 && (
                                <button onClick={() => goToPage(1)} aria-current="page" className={`inline-flex items-center px-4 py-2 text-sm font-semibold border border-gray-700 ${localPage === 1 ? 'bg-indigo-400' : ''}`}>1</button>
                            )}
                            {localPage > 3 && (
                                <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-semibold border border-gray-700">...</button>
                            )}
                            {localPage > 2 && (
                                <button onClick={() => goToPage(localPage - 1)} className={`inline-flex items-center px-4 py-2 text-sm font-semibold borderborder-gray-700 ${localPage - 1 === currentPage ? 'bg-indigo-400' : ''}`}>{localPage - 1}</button>
                            )}
                            <button className={`inline-flex items-center px-4 py-2 text-sm font-semibold border border-gray-700 ${localPage === currentPage ? 'bg-indigo-400' : ''}`}>{localPage}</button>

                            {localPage < totalPages - 1 && (
                                <button onClick={() => goToPage(localPage + 1)} className={`inline-flex items-center px-4 py-2 text-sm font-semibold border border-gray-700 ${localPage + 1 === currentPage ? 'bg-indigo-400' : ''}`}>{localPage + 1}</button>
                            )}
                            {localPage < totalPages - 2 && (
                                <button className="inline-flex items-center px-4 py-2 text-sm font-semibold borderborder-gray-700">...</button>
                            )}
                            {localPage < totalPages && (
                                <button onClick={() => goToPage(totalPages)} className={`inline-flex items-center px-4 py-2 text-sm font-semibold border border-gray-700 ${totalPages === currentPage ? 'bg-indigo-400' : ''}`}>{totalPages}</button>
                            )}
                            <button onClick={nextPage} className={`inline-flex items-center px-2 py-2 text-sm ${localPage === totalPages ? 'disable' : ''} font-semibold border rounded-r-md border-gray-700`}>
                                <span className="sr-only">Next</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </nav>
                    </div>
                </>

            </div>
        </div>
    )
}

export default Users;