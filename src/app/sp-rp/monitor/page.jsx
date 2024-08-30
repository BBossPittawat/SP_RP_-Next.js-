'use client'
import Image from "next/image"
import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import useStore from '@/lib/store'

export default function Navbar() {
    const {
        data_2: DT2,
        fetchData_2: FetchDT2,
        loading_2: LoadingDT2,
        data_18: tableData,
        fetchData_18: fetchTableData,
        error_18: ErrDT18
    } = useStore()

    const [Department, setDepartment] = useState(null)
    const [localTableData, setLocalTableData] = useState(tableData)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search)
            setDepartment(searchParams.get('dept'))
        }
    }, [])

    useEffect(() => {
        FetchDT2()
    }, [FetchDT2])

    useEffect(() => {
        let interval
        if (Department) {
            fetchTableData(Department)
            interval = setInterval(() => {
                fetchTableData(Department)
            }, 10000) // 10 sec timer
        }
        return () => clearInterval(interval)
    }, [Department, fetchTableData])

    // Sync localTableData with tableData
    useEffect(() => {
        setLocalTableData(tableData)
    }, [tableData])

    // Combine error handling and state setting in one effect
    useEffect(() => {
        if (ErrDT18) {
            // console.log("tableData before setting null:", tableData)
            useStore.setState({ tableData: null })
            // console.error("Error fetching table data:", ErrDT18)
            // console.log("tableData after setting null:", tableData)
        }
    }, [ErrDT18])

    useEffect(() => {
        let interval_alert

        interval_alert = setInterval(() => {
            if (localTableData && localTableData.some(row => row.RECENTLY === 1)) {
                const audio = new Audio('/Alert/alert.mp3')
                audio.play()
            }
        }, 5000) // 1 minute timer

        return () => clearInterval(interval_alert)
    }, [localTableData])

    return (
        <>
            <style jsx global>
                {`
                body {
                    background-color: #1A2130;
                    color: #FDFFE2;
                }
                .navbar-center {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .blinking-text {
                    animation: blinkingText 1s infinite;
                }
                @keyframes blinkingText {
                    0% { color: yellow; }
                    50% { color: white; }
                    100% { color: yellow; }
                }
            `}
            </style>

            <nav>
                <div className="navbar py-1 bg-blue-400 text-black flex justify-between items-center pr-5">
                    <div className="flex items-center">
                        <Image src="/Image/sr-rp-icon.svg" alt="icon" width={40} height={40} className="mx-3" />
                        <a className="btn btn-ghost text-3xl font-bold text-white">SP-RP</a>
                    </div>

                    <div className="navbar-center">
                        <span className="text-3xl font-bold text-white">R E Q U E S T - M O N I T O R I N G</span>
                        <span className="loading loading-ring loading-lg"></span>
                    </div>

                    {LoadingDT2 ? (
                        <>
                            <Spin size="large" />
                        </>
                    ) : (
                        <>
                            <span className="text-3xl mr-4 font-bold text-white">{Department}</span>
                        </>
                    )}

                </div>
            </nav>

            <div className="overflow-x-auto text-white mt-5">
                <table className="table text-center text-2xl">
                    <thead className="text-white text-3xl">
                        <tr>
                            <th>DATE</th>
                            <th>LOCATION</th>
                            <th>PART NO</th>
                            <th>QTY</th>
                            <th>PIC</th>
                            <th>REMARK</th>
                        </tr>
                    </thead>
                    <tbody>

                        {ErrDT18 ? (
                            <tr><td colSpan="6">No Data Available</td></tr>

                        ) : (
                            localTableData && localTableData.map((row, index) => (
                                <tr key={index} className={row.RECENTLY === 1 ? "blinking-text" : ""}>
                                    <td>{row.REQ_DATE}</td>
                                    <td>{row.LOC}</td>
                                    <td>{row.PART_NO}</td>
                                    <td>{row.QTY}</td>
                                    <td>
                                        {row.REQ_PIC && (
                                            <>
                                                {row.REQ_PIC}
                                                <br />
                                            </>
                                        )}
                                        {row.EMP_NAME}
                                    </td>
                                    <td>{row.REMARK}</td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>

        </>
    )
}