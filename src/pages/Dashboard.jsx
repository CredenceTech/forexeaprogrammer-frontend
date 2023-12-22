import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../utils';
import { useNavigate } from 'react-router-dom'
import image from '../assets/image.png'
const Dashboard = () => {
    const textAreaRef = useRef(null);
    const textInputRef = useRef(null);
    const [name] = useLocalStorage('user');
    const nagivate = useNavigate();
    function copyToClipboard(e) {
        textAreaRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        toast.success('Copied!')
    };
    function copyToClipboard1(e) {
        textInputRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        toast.success('Copied!')
    };

    const logout = () => {
        localStorage.clear('user')
        toast.success('logout successfully')
        nagivate('/login')
    }

    const value = `curl --location --request GET 'https://api.forexeaprogrammer.com/api/validate-account' 
--header 'Content-Type: application/json' 
--header 'Authorization: Bearer ${name?.api_key}' 
--data '{
    "name": "",
    "account_number": ""
 }'`



    return (
        <>
            <header className="text-gray-400 bg-gray-500 body-font">
                <div className="container mx-auto flex flex-wrap p-5 justify-between md:flex-row items-center">
                    <a href='/' className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                        <img height={40} width={40} className='rounded-full' src={image} alt="logo" />
                        <span className="ml-3 text-xl">{name?.email}</span>
                    </a>
                    <button onClick={() => { logout() }} className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">Log Out
                    </button>
                </div>
            </header>
            <section className="text-gray-400 bg-gray-900 body-font">
                <div className="container px-5 py-4  mx-auto">
                    <div className="lg:w-2/3 flex flex-row justify-between  items-start mx-auto">
                        <label className="flex-grow sm:pr-16 text-2xl pb-5 font-medium title-font text-white" >Api Key : - </label>
                    </div>
                    <div className="lg:w-2/3 flex flex-col lg:flex-row justify-between  items-start mx-auto">
                        <div className=" w-full lg:w-4/5">
                            <input ref={textAreaRef} type="text" value={name?.api_key} readOnly className="w-full rounded-md focus:ring bg-gray-500 p-3 dark:border-gray-700 dark:text-gray-900" />
                        </div>
                        <button onClick={copyToClipboard} className="flex-shrink-0 text-white bg-indigo-500 border-0  p-3 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0"><svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" viewBox="0 0 448 512"><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" /></svg></button>
                    </div>
                </div>
            </section>
            <section className="text-gray-400 mt-10 bg-gray-900 body-font">
                <div className="container px-5  mx-auto">


                    <div className="lg:w-2/3 flex flex-col justify-between  items-start mx-auto">
                        {/* <div className="w-full">
                            <textarea ref={textInputRef} type="text" rows={10} value={JSON.stringify(json, null, 2)} readOnly className="w-full  rounded-md focus:ring bg-gray-500 p-3 dark:border-gray-700 dark:text-gray-900" />
                        </div> */}
                        <div className="w-full">
                            <textarea ref={textInputRef} type="text" rows={12} value={value} readOnly className="w-full  text-left rounded-md focus:ring bg-gray-500 p-3 dark:border-gray-700 dark:text-gray-900" />
                        </div>
                        <button onClick={copyToClipboard1} className="flex-shrink-0 text-white bg-indigo-500 border-0  p-3 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0"><svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" viewBox="0 0 448 512"><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" /></svg></button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Dashboard