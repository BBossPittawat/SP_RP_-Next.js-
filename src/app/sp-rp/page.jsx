'use client'
import { useEffect, useState } from 'react'
import Image from "next/image"
import Navbar from './Navbar'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import axios from 'axios';

export default function Page() {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');

    const UsernameData = (event) => setUsername(event.target.value);
    const PasswordData = (event) => setPassword(event.target.value);

    // ---------------------------------------------------------------------------------------- DDL Department request
    const [ddlDepartments, setDdlDepartments] = useState('');

    const ddlDepartmentData = async () => {
        try {
            const response = await axios.get('/api/v1/log_in/ddlDepartment', {
                headers: {
                    'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });
            const jsonData = await response.data
            setDdlDepartments(jsonData.data.departments);

        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        ddlDepartmentData();
    }, []);
    // ----------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------- Submit button request
    const [SubmitLoading, setSubmitLoading] = useState(false);
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('');

    const SubmitData = async () => {
        try {
            setSubmitLoading(true);
            setErrorMessage('');
            const response = await axios.post('/api/v1/log_in/validate', {
                username,
                password,
                department,
            }, {
                headers: {
                    'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });

            const data = await response.data
            console.log(data)
            router.push('/sp-rp/items');

        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Failed to connect to the server.';

            setErrorMessage(errorMessage);
            setSubmitLoading(false);
        }
    };
    // ----------------------------------------------------------------------------------------

    return (

        <>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-10 px-11">
                    <div className="grid grid-cols-2 justify-items-center">
                        <div>

                            <div className="flex justify-center items-center w-96 h-96 rounded-full bg-custom-yellow">
                                <Image src="/Image/crm.gif" alt="icon" width={300} height={300} unoptimized />
                            </div>

                            <div className="flex flex-col items-center mt-3">
                                <div className="text-4xl font-bold text-blue-500">SPARE PART</div>
                                <div className="text-4xl font-bold text-blue-500 mt-3">REQUEST - PAYOUT</div>
                            </div>
                        </div>

                        <div className="w-8/12 h-full bg-blue-300 rounded-3xl drop-shadow-2xl flex flex-col items-center justify-center py-10">

                            <div className="text-5xl font-bold text-white">LOG IN</div>

                            <input
                                type="number"
                                placeholder="username : ex.90701"
                                className="input input-bordered w-10/12 mt-10"
                                value={username}
                                onChange={UsernameData}
                            />

                            <input
                                type="password"
                                placeholder="password : personal ID"
                                className="input input-bordered w-10/12 mt-10"
                                value={password}
                                onChange={PasswordData}
                            />

                            <select
                                className="select select-bordered w-10/12 mt-10"
                                value={department} onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option disabled value="">Spare part department</option>
                                {
                                    ddlDepartments && ddlDepartments.map((dep) => (
                                        <option key={dep} value={dep}>{dep}</option>
                                    ))
                                }
                            </select>

                            {!SubmitLoading ? (
                                <button
                                    className="btn btn-warning mt-10 w-10/12 text-gray-500 text-3xl font-bold"
                                    onClick={SubmitData}
                                >
                                    SUBMIT
                                </button>
                            ) : (
                                <button className="mt-10 w-10/12 text-gray-500 text-3xl font-bold">
                                    <span className="loading loading-spinner"></span> LOADING...
                                </button>
                            )}

                            {errorMessage && (
                                <p className='text-red-500 mt-2'>Error : {errorMessage}</p>
                            )}

                        </div>

                    </div>

                </main>
                <Footer />
            </div>
        </>

    )

}