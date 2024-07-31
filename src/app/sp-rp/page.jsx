'use client'
import { useEffect, useState } from 'react'
import Image from "next/image"
import Navbar from './Navbar'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import { validateLogin } from '@/actions/validateLogin'
import { Select, Skeleton, Alert, Spin } from 'antd'
import useStore from '@/lib/store'

const { Option } = Select

export default function Page() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [department, setDepartment] = useState('')

    // ---------------------------------------------------------------------------------------- DDL Department request
    const { data_2, loading_2, error_2, fetchData_2 } = useStore()

    useEffect(() => {
        fetchData_2()
    }, [fetchData_2])

    // ---------------------------------------------------------------------------------------- Submit button request
    const [SubmitLoading, setSubmitLoading] = useState(false)
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitLoading(true)

        try {
            await validateLogin(username, password, department)
            router.push('/sp-rp/items')
        } catch (error) {
            const errorMessage = error.response.data.message ? error.response.data.message : 'Failed to connect to the server.'
            setErrorMessage(errorMessage)
            setSubmitLoading(false)
        }

        // setSubmitLoading(false)
    }

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

                            {loading_2 ? (
                                <Spin size="large" />
                            ) : (
                                <>
                                    <div className="text-5xl font-bold text-white">LOG IN</div>

                                    <input
                                        className="input input-bordered w-10/12 mt-10"
                                        type="number" placeholder="username : emp. code ex.90701" value={username}
                                        onChange={(e) => setUsername(e.target.value)} disabled={SubmitLoading} />

                                    <input
                                        className="input input-bordered w-10/12 mt-10"
                                        type="password" placeholder="password : birthday ex.19991201" value={password}
                                        onChange={(e) => setPassword(e.target.value)} disabled={SubmitLoading} />

                                    <Select
                                        className="mt-10"
                                        style={{ width: '83%', height: '10%' }}
                                        placeholder="Select a Department"
                                        // value={department}
                                        onChange={(value) => setDepartment(value)}
                                        disabled={SubmitLoading}
                                    >
                                        {data_2?.map((dep) => (
                                            <Option
                                                key={dep}
                                                value={dep}>{dep}
                                            </Option>
                                        ))}
                                    </Select>


                                    {!SubmitLoading ? (
                                        <>

                                            <button
                                                className="btn btn-warning mt-10 w-10/12 text-gray-500 text-3xl font-bold"
                                                onClick={handleSubmit}
                                            >
                                                SUBMIT
                                            </button>

                                            {errorMessage && (
                                                <p className='text-red-500 mt-2'>Error : {errorMessage}</p>
                                            )}
                                        </>
                                    ) : (
                                        <button className="mt-10 w-10/12 text-gray-500 text-3xl font-bold">
                                            <span className="loading loading-spinner"></span> LOADING...
                                        </button>
                                    )}

                                </>

                            )}

                        </div>

                    </div>

                </main>
                <Footer />
            </div>
        </>

    )

}