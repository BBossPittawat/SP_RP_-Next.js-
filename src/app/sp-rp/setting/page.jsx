'use client'
import { useState, useEffect } from 'react'
import { Card, Image, Badge, Spin, Pagination, Alert, Menu } from 'antd'
import Navbar from '@/components/Navbar'
import useStore from '@/lib/store'
import { MonitorOutlined } from '@ant-design/icons'

import Ci_payout from './Ci_payout'
import Admin from './Admin'
// import Spare_part from './Spare_part_v1'
import Budget from './Budget'
import Machine from './Machine'

import Spare_part_v2 from './Spare_part_v2'

export default function Page() {

    const [selectedMenu, setSelectedMenu] = useState('2')
    const [Department, setDepartment] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const handleMenuClick = (menuKey) => {
        setSelectedMenu(menuKey)
    }

    const {
        data_4,
        // loading_4,
        error_4,
        fetchData_4,
        data_8,
        // loading_8,
        // error_8,
        // fetchData_8
    } = useStore()

    useEffect(() => {
        if (data_8) {
            setSearchResults(data_8)
        }
        if (!data_4) {
            fetchData_4()
        }
    }, [data_8, data_4, fetchData_4])

    useEffect(() => {
        if (data_4 && data_4.payload && !error_4) {
            setDepartment(data_4.payload.department)
        }
    }, [data_4, error_4])

    return (
        <>
            <Navbar />

            <div className='flex flex-row'>
                <div className="drawer drawer-open basis-40">
                    <input id="sidebar" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-side bg-blue-100 flex items-center justify-center">
                        <label htmlFor="sidebar" className="drawer-overlay"></label>
                        <div className="flex flex-col items-center w-48">

                            <h2 className="card-title text-center mt-4 text-gray-600">{Department}</h2>

                            <Menu
                                className='mt-3'
                                mode="inline"
                                selectedKeys={[selectedMenu]}
                                onClick={({ key }) => handleMenuClick(key)}
                                items={[
                                    { key: '2', label: 'Admin Member' },
                                    { key: '1', label: 'CI Payout' },
                                    { key: '4', label: 'Expense budget' },
                                    { key: '5', label: 'Machine' },
                                    // { key: '3', label: 'Spare Part' },
                                    { key: '6', label: 'Spare Part' },
                                ]}
                                style={{ backgroundColor: 'transparent', borderRightColor: 'transparent' }}
                            />

                        </div>
                    </div>
                </div>

                <div className='basis-full p-3'>
                    {selectedMenu === '1' && <Ci_payout department={Department} />}
                    {selectedMenu === '2' && <Admin department={Department} />}
                    {/* {selectedMenu === '3' && <Spare_part department={Department} />} */}
                    {selectedMenu === '4' && <Budget department={Department} />}
                    {selectedMenu === '5' && <Machine department={Department} />}
                    {selectedMenu === '6' && <Spare_part_v2 department={Department} />}
                </div>
            </div>
        </>
    )
}