'use client'

import { useState, useEffect } from 'react'
import { TextField, Autocomplete } from '@mui/material'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import useStore from '@/lib/store'
import Image from 'next/image'

export default function Navbar() {
    const router = useRouter()
    const [filteredOptions, setFilteredOptions] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const {
        data_4,
        loading_4,
        error_4,
        fetchData_4,
        data_38,
        fetchData_38
    } = useStore()

    useEffect(() => {
        if (!data_4) fetchData_4()
    }, [fetchData_4, data_4])

    useEffect(() => {
        if (data_4) {
            const department = data_4?.payload?.department
            if (department) fetchData_38(department)
        }
    }, [data_4, fetchData_38])

    useEffect(() => {
        if (error_4 || (data_4 && !data_4.payload?.name)) {
            router.push('/sp-rp')
            window.location.reload()
        }
    }, [error_4, data_4, router])

    useEffect(() => {
        setFilteredOptions(data_38 || [])
    }, [data_38])

    const handleLogout = async () => {
        try {
            await axios.post('/api/v1/items/logout', {}, { headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' } })
            router.push('/sp-rp')
        } catch (error) {
            console.error('Failed to log out:', error)
        }
    }

    const handleSearchChange = (_, value) => {
        setSearchValue(value)
        if (!value) setFilteredOptions(data_38)
        else {
            setFilteredOptions(data_38.filter(item =>
                item.PART_NO.includes(value) || item.SPEC.includes(value)
            ))
        }
    }

    const handleCardClick = (ID) => {
        if (ID) window.open(`/sp-rp/request?id=${ID}`, '_blank')
        else console.error('Invalid ID')
    }


    return (
        <nav className="navbar py-1 bg-blue-400 text-black flex justify-between items-center pr-5">
            <div className="flex items-center">
                <Image src="/Image/sr-rp-icon.svg" alt="icon" width={40} height={40} className="mx-3" />
                <a className="btn btn-ghost text-3xl font-bold text-white" onClick={() => router.push('/sp-rp/items')}>
                    SP-RP
                </a>
            </div>

            <Autocomplete
                freeSolo
                options={filteredOptions.map(option => ({
                    label: `${option?.CCC} : ${option?.PART_NO} ( ${option?.SPEC} )`,
                    ID: option.ID,
                    PART_NO: option.PART_NO,
                    SPEC: option.SPEC
                }))}
                value={searchValue}
                onInputChange={handleSearchChange}
                onChange={(event, value) => handleCardClick(value?.ID)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search Part no."
                        variant="outlined"
                        style={{
                            width: '900px',
                            backgroundColor: 'white',
                            borderRadius: '25px'
                        }}
                        InputProps={{
                            ...params.InputProps,
                            style: {
                                borderRadius: '25px'
                            },
                            classes: {
                                notchedOutline: {
                                    borderWidth: '0px'
                                }
                            }
                        }}
                    />
                )}
                filterOptions={(options, state) =>
                    options.filter(option =>
                        option.label.split(' : ')[1].split('  (')[0].includes(state.inputValue)
                        || option.label.split(' (')[1].replace(')', '').includes(state.inputValue)
                    )
                }
            />

            <div className="flex items-center">
                <ul className="menu menu-horizontal">
                    <li>
                        {loading_4 ? (
                            <div>Loading...</div>
                        ) : (
                            <>
                                <details>
                                    <summary>
                                        <div className="md:block hidden">
                                            <div className="text-xg text-center font-bold text-white">
                                                {data_4?.payload?.name}
                                            </div>
                                            <div className="text-xs text-center font-bold text-white">
                                                (<span style={{ margin: '0 4px' }}>{data_4?.payload?.status}</span>)
                                            </div>
                                        </div>
                                    </summary>
                                    <ul className="p-5 rounded-t-none z-50 bg-white shadow-lg">
                                        {data_4?.payload?.status === 'ADMIN' && (
                                            <li><a onClick={() => router.push('/sp-rp/setting')}>Setting</a></li>
                                        )}
                                        <li><a onClick={handleLogout}>Log out</a></li>
                                    </ul>
                                </details>
                            </>
                        )}
                    </li>
                </ul>
            </div>

        </nav>
    )
}