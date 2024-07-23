'use client'
import { useEffect, useState } from 'react'
import { Table, Input, Select, Button, Spin } from 'antd'
import useStore from '@/lib/store'

const { Option } = Select

export default function Budget({ department }) {

    const {
        data_28,
        loading_28,
        fetchData_28,
        data_29,
        loading_29,
        fetchData_29,
        data_30,
        fetchData_30,
        fetchData_31,
        fetchData_32,
    } = useStore()

    const getCurrentYearOptions = () => {
        const currentYear = new Date().getFullYear()
        const currentYearLastTwoDigits = currentYear.toString().slice(-2)
        const options = [
            `${currentYearLastTwoDigits - 1}F`,
            `${currentYearLastTwoDigits}F`,
            `${parseInt(currentYearLastTwoDigits) + 1}F`
        ]
        return options
    }

    const yearOptions = getCurrentYearOptions()

    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [editingRow, setEditingRow] = useState(null)
    const [showError, setShowError] = useState(false)

    const [formData, setFormData] = useState(
        {
            ID: 0,
            PERIOD: null,
            CCC_NAME: null,
            BUDGET_NO: null,
            DESCRIPTION: null,
            PRICE: null,
            CURR: null,
            GP_NAME: null,
        }
    )

    useEffect(() => {
        if (!data_29 && department) {
            fetchData_29(department)
            fetchData_30(department)
        }
    }, [department])

    const columns = [
        {
            title: 'PERIOD',
            dataIndex: 'PERIOD',
            align: 'center',
            render: (text, record) => (
                editingRow === record.key
                    ? <Select value={formData.PERIOD} style={{ width: 120 }} onChange={(value) => setFormData({ ...formData, PERIOD: value })}>
                        {yearOptions.map(option => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                    : <Select value={formData.PERIOD} style={{ width: 120 }} onChange={(value) => setFormData({ ...formData, PERIOD: value })}>
                        {yearOptions.map(option => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
            )
        },
        {
            title: 'CCC',
            dataIndex: 'CCC_NAME',
            align: 'center',
            render: (text, record) => (
                <Select
                    value={formData.CCC_NAME}
                    style={{ width: 120 }}
                    onChange={(value) => setFormData({ ...formData, CCC_NAME: value })}
                >
                    {data_30 && data_30.map(item => (
                        <Option key={item.ID} value={item.ID}>{item.CCC_NAME}</Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'BUDGET_NO',
            dataIndex: 'BUDGET_NO',
            align: 'center', render: (text) => <Input value={formData.BUDGET_NO} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        },
        {
            title: 'DESCRIPTION', dataIndex: 'DESCRIPTION', align: 'center', render: (text) => <Input value={formData.DESCRIPTION} onChange={(e) => setFormData({ ...formData, DESCRIPTION: e.target.value })} />
        },
        {
            title: 'PRICE', dataIndex: 'PRICE', align: 'center', render: (text, record) => (
                editingRow === record.key
                    ? <Input type='number' value={formData.PRICE} onChange={(e) => setFormData({ ...formData, PRICE: e.target.value })} />
                    : <Input type='number' value={formData.PRICE} onChange={(e) => setFormData({ ...formData, PRICE: e.target.value })} />
            )
        },
        {
            title: 'CURR', dataIndex: 'CURR', align: 'center', render: (text) => (
                <Select value={formData.CURR} style={{ width: 120 }} onChange={(value) => setFormData({ ...formData, CURR: value })}>
                    <Option value="THB">THB</Option>
                    <Option value="JPY">JPY</Option>
                </Select >
            )
        },
        {
            title: 'GROUP',
            dataIndex: 'GP_NAME',
            align: 'center',
            render: (text) => (
                <Select
                    value={formData.GP_NAME || groupOptions.find(option => option.value === text)?.key}
                    style={{ width: 120 }}
                    onChange={(value) => setFormData({ ...formData, GP_NAME: value })}
                >
                    {groupOptions.map(option => (
                        <Option key={option.key} value={option.key}>{option.value}</Option>
                    ))}
                </Select>
            )
        }
    ]

    const groupOptions = [
        { key: 1, value: 'Processing cost' },
        { key: 2, value: 'Indirect cost' }
    ]

    const plainTextColumns = [
        { title: 'PERIOD', dataIndex: 'PERIOD', align: 'center' },
        { title: 'CCC', dataIndex: 'CCC_NAME', key: 'ID', align: 'center' },
        { title: 'BUDGET_NO', dataIndex: 'BUDGET_NO', align: 'center' },
        { title: 'DESCRIPTION', dataIndex: 'DESCRIPTION', align: 'center' },
        { title: 'PRICE', dataIndex: 'PRICE', align: 'center' },
        { title: 'CURR', dataIndex: 'CURR', align: 'center' },
        { title: 'GROUP', dataIndex: 'GP_NAME', align: 'center' },
        {
            key: "action",
            align: "center",
            render: (text, record) => (
                <Button type="primary" onClick={() => handleEdit(record)}>EDIT</Button>
            )
        }
    ]

    const handleEdit = (record) => {
        setEditingRow(record.key)
        setFormData({
            ID: record.ID,
            PERIOD: record.PERIOD,
            CCC_NAME: record.CCC_ID,
            BUDGET_NO: record.BUDGET_NO,
            DESCRIPTION: record.DESCRIPTION,
            PRICE: record.PRICE,
            CURR: record.CURR,
            GP_NAME: record.GP_ID
        })
    }

    const handlePeriodChange = (value) => {
        fetchPeriod(value)
    }

    const fetchPeriod = async (period) => {
        await fetchData_28(department, period)
    }

    const RegisterClicked = async () => {
        if (Object.values(formData).every(value => value !== null && value !== '')) {
            setShowError(false)
            await fetchData_31({
                period: formData.PERIOD,
                ccc_id: formData.CCC_NAME,
                budget_no: formData.BUDGET_NO,
                description: formData.DESCRIPTION,
                price: formData.PRICE,
                curr: formData.CURR,
                group_id: formData.GP_NAME
            })
            setFormData({
                PERIOD: null,
                CCC_NAME: null,
                BUDGET_NO: null,
                DESCRIPTION: null,
                PRICE: null,
                CURR: null,
                GP_NAME: null
            })
            await fetchPeriod(formData.PERIOD)
        } else {
            setShowError(true)
        }
    }

    const ReviseClicked = async () => {
        if (Object.values(formData).every(value => value !== null && value !== '')) {
            setShowError(false)
            await fetchData_32({
                id: formData.ID,
                period: formData.PERIOD,
                ccc_id: formData.CCC_NAME,
                budget_no: formData.BUDGET_NO,
                description: formData.DESCRIPTION,
                price: formData.PRICE,
                curr: formData.CURR,
                group_id: formData.GP_NAME
            })
            setFormData({
                ID: 0,
                PERIOD: null,
                CCC_NAME: null,
                BUDGET_NO: null,
                DESCRIPTION: null,
                PRICE: null,
                CURR: null,
                GP_NAME: null
            })
            await fetchPeriod(formData.PERIOD)
        } else {
            setShowError(true)
        }
        setEditingRow(null)
    }

    return (
        <>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Expense budget</h2>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">

                            <Table columns={columns} dataSource={[formData]} pagination={false} />

                            {editingRow === null ? (
                                <button className="btn btn-sm btn-active btn-neutral" onClick={RegisterClicked}>R E G I S T E R</button>
                            ) : (
                                <button className="btn btn-sm btn-active btn-warning" onClick={() => ReviseClicked(formData)}>R E V I S E</button>
                            )}

                            {showError && <p className="text-red-500 text-center">ERROR : กรุณากรอกข้อมูลให้ครบถ้วน</p>}

                        </div>
                    </div>

                    {loading_29 ? (
                        <Spin size="large" />
                    ) : (
                        <>
                            {data_29 && (
                                <Select
                                    className='mt-5'
                                    showSearch
                                    placeholder='PERIOD'
                                    optionFilterProp='label'
                                    style={{ width: "100px", borderRadius: "15px" }}
                                    onChange={handlePeriodChange}
                                >
                                    {data_29.map((item, index) => (
                                        <Option key={index} value={item.PERIOD}>{item.PERIOD}</Option>
                                    ))}
                                </Select>
                            )}
                        </>
                    )}

                    {loading_28 ? (
                        <Spin size="large" />
                    ) : (
                        <>
                            {data_28 && (
                                <>
                                    {/* New Table for displaying fetched data as plain text */}
                                    {/*<h2 className="card-title mt-4">Fetched Data Table</h2>*/}
                                    <Table columns={plainTextColumns} dataSource={data_28} pagination={false} rowKey={(record) => record.key} />
                                </>
                            )}
                        </>
                    )}

                </div>
            </div>
        </>
    )
}