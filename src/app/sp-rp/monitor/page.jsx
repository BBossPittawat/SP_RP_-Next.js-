'use client'
import Image from "next/image"
import { Input, Button, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import useStore from '@/lib/store'

export default function Navbar() {

    const {
        data_2: DT2,
        fetchData_2: FetchDT2,
        loading_2: LoadingDT2,
        data_18: tableData,
        fetchData_18: fetchTableData,
        // loading_18: loadingTableData,
        error_18: ErrDT18
    } = useStore()

    const [selectedDepartment, setSelectedDepartment] = useState('')

    const onDepartmentChange = (value) => {
        setSelectedDepartment(value)
        fetchTableData(value)
    }

    useEffect(() => {
        FetchDT2()
    }, [FetchDT2])

    useEffect(() => {
        let interval
        if (selectedDepartment) {
            interval = setInterval(() => {
                fetchTableData(selectedDepartment)
                console.log("timer trigger")
            }, 5000) // 5 sec timer
        }

        return () => clearInterval(interval)
    }, [selectedDepartment, fetchTableData])

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
                            <Select
                                showSearch
                                placeholder="department"
                                value={selectedDepartment || undefined}
                                onChange={onDepartmentChange}
                                options={DT2?.map(dep => ({ value: dep, label: dep }))}
                                className="text-center mt-2"
                                style={{ width: '150px', height: '40px', fontSize: '16px' }}
                                size="large"
                            />
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

                        {!ErrDT18 && tableData && tableData.map((row, index) => (
                            // Apply blinking effect if RECENTLY is 1
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
                        }

                        {ErrDT18 && (
                            <tr><td colSpan="6">No Data Available</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

        </>
    )
}