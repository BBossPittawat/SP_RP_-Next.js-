'use client'
import useStore from '@/lib/store'
import { useState, useEffect } from 'react'
import { Table, Button, Input } from 'antd'

export default function Admin({ department }) {

    const {
        data_22,
        loading_22,
        fetchData_22,
        // data_23,
        // loading_23,
        fetchData_23,
        error_23
    } = useStore()
    const [inputValue, setInputValue] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!data_22 && department) fetchData_22(department)
    }, [department])

    const columns = [
        {
            title: 'EMP. CODE',
            dataIndex: 'EMP_CD',
            key: 'EMP_CD',
            align: 'center'
        },
        {
            title: 'NAME',
            dataIndex: 'EMPNAME_ENG',
            key: 'EMPNAME_ENG',
            align: 'center'
        }
    ]

    const handleSubmit = async () => {
        const isDuplicate = data_22?.some(item => item.EMP_CD === inputValue)
        if (isDuplicate) {
            setErrorMessage('พบข้อมูลซ้ำ')
        } else {

            const requestData = {
                emp_code: inputValue,
                department_id: data_22[0].DEP_ID,
                department: data_22[0].DEPARTMENT
            }

            setErrorMessage('')
            await fetchData_23(requestData)

            if (!error_23) {
                await fetchData_22(department)
            }

        }

    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">REGISTRATION</h2>
                    <div className="card-actions flex flex-col items-end">
                        {/* REGISTRATION */}
                        <Input
                            type="number"
                            placeholder="input emp. code"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            className="mb-2"
                        />
                        <Button type="primary" onClick={handleSubmit}>SUBMIT</Button>
                        {errorMessage && (
                            <div className="text-red-500 mt-2">{errorMessage}</div>
                        )}

                        {error_23 &&
                            <div className="text-red-500 mt-2">ไม่พบข้อมูลในระบบ</div>
                        }

                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">CURRENT ADMIN</h2>

                    <Table
                        columns={columns}
                        dataSource={data_22}
                        loading={loading_22}
                        rowKey="EMP_CD"
                        pagination={false}
                    />
                </div>
            </div>
        </div >
    )
}