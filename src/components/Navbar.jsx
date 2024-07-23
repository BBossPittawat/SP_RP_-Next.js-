import Image from "next/image"
import { Input, Button, Select, Spin } from 'antd'
import { SearchOutlined, LogoutOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useStore from '@/lib/store'

export default function Navbar() {
    const router = useRouter()
    const [filteredOptions, setFilteredOptions] = useState([])

    const handleLogout = async () => {
        try {
            await axios.post('/api/v1/items/logout', {}, {
                headers: {
                    'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            })
            router.push('/sp-rp')
        } catch (error) {
            console.error('Failed to log out:', error)
        }
    }

    const {
        data_4,
        loading_4,
        error_4,
        fetchData_4,
        data_38,
        loading_38,
        error_38,
        fetchData_38
    } = useStore()

    useEffect(() => {
        if (!data_4) fetchData_4()
    }, [fetchData_4])

    useEffect(() => {
        // if (data_4) {
        //     const department = data_4?.payload?.department
        //     if (department) fetchData_38(department)
        // }
    }, [data_4])

    useEffect(() => {
        if (error_4 || (data_4 && data_4.payload && !data_4.payload.name)) {
            window.location.reload()
            router.push('/sp-rp')
        }
    }, [error_4, data_4])

    useEffect(() => {
        setFilteredOptions(data_38 || [])
    }, [data_38])

    // const onChange = (value) => {
    //     const selectedItem = filteredOptions.find(item => item.PART_NO === value)
    //     if (selectedItem) window.open(`/sp-rp/request?id=${selectedItem.ROWID}`, '_blank')
    // }

    const onSearch = (value) => {
        if (!value) setFilteredOptions(data_38)
        else setFilteredOptions(data_38.filter(item => item.PART_NO.includes(value)))
    }

    const SettingClick = async () => {
        router.push('/sp-rp/setting')
    }

    return (
        <nav>
            <div className="navbar py-1 bg-blue-400 text-black flex justify-between items-center pr-5">
                <div className="flex items-center">
                    <Image src="/Image/sr-rp-icon.svg" alt="icon" width={40} height={40} className="mx-3" />
                    <a
                        className="btn btn-ghost text-3xl font-bold text-white"
                        onClick={() => router.push('/sp-rp/items')}
                    >
                        SP-RP
                    </a>
                </div>

                <Select
                    showSearch
                    placeholder="Search Part no."
                    optionFilterProp="label"
                    // onChange={onChange}
                    // onSearch={onSearch}
                    style={{ width: 900, borderRadius: '15px' }}
                // filterSort={filteredOptions.map(item => ({ value: item.PART_NO, label: item.PART_NO }))}
                />

                <div className="flex items-center">
                    <ul className="menu menu-horizontal">
                        <li>

                            {loading_4 & !error_4 ? (
                                <Spin size="large" />
                            ) : (
                                <>
                                    <details>
                                        <summary>
                                            <div className="md:block hidden">
                                                <div className="text-xg text-center font-bold text-white">
                                                    {data_4?.payload?.name}
                                                </div>
                                                <div className="text-xs text-center font-bold text-white">
                                                    (
                                                    <span style={{ margin: '0 4px' }}>{data_4?.payload?.status}</span>
                                                    )
                                                </div>
                                            </div>
                                        </summary>
                                        <ul className="p-5 rounded-t-none z-50 bg-white shadow-lg">

                                            {data_4?.payload?.status === 'ADMIN' && (
                                                <li><a onClick={SettingClick}>Setting</a></li>
                                            )}

                                            <li><a onClick={handleLogout}>Log out</a></li>
                                        </ul>
                                    </details>
                                </>
                            )}

                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    )
}