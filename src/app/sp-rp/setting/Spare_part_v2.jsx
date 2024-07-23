'use client'
import useStore from '@/lib/store'
import { useState, useEffect } from 'react'
import { Table, Upload, Button, Input, Select, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

export default function Spare_part({ department }) {
    const {
        data_24,
        loading_24,
        fetchData_24,
        data_25,
        loading_25,
        fetchData_25,
        data_26,
        loading_26,
        fetchData_26,
        fetchData_27,
        data_30,
        loading_30,
        fetchData_30,
    } = useStore()

    const [formData, setFormData] = useState({
        ID: 0,
        PERIOD: null,
        CCC_NAME: null,
        BUDGET_NO: null,
        DESCRIPTION: null,
        PRICE: null,
        CURR: null,
        GP_NAME: null
    })

    useEffect(() => {
        if (!data_30) fetchData_30(department)
    }, [fetchData_30])

    useEffect(() => {
        if (formData.CCC_NAME) fetchData_24(department)
    }, [formData.CCC_NAME])

    useEffect(() => {
        if (data_30) fetchData_24(department)
    }, [data_30])

    const handleUploadChange = ({ fileList }, record) => {
        // handle file upload change
    }

    const columns = [
        {
            title: 'Upload IMG.',
            key: 'addImage',
            align: 'center',
            render: (_, record) => {
                // const uploadedFile = tableData.find(item => item.ID === record.ID)?.img
                return (
                    <Upload onChange={({ fileList }) => handleUploadChange({ fileList }, record)} showUploadList={false}>
                        <Button icon={<UploadOutlined />} size="small">
                            {/* {uploadedFile ? uploadedFile.name : "Upload"} */}
                        </Button>
                    </Upload>
                )
            }
        },
        {
            title: 'PART NO.',
            dataIndex: 'BUDGET_NO',
            align: 'center', render: (text) => <Input disabled value={formData.BUDGET_NO} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        },
        {
            title: 'SPEC',
            dataIndex: 'BUDGET_NO',
            align: 'center', render: (text) => <Input disabled value={formData.BUDGET_NO} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        },
        {
            title: 'PRODUCT',
            dataIndex: 'BUDGET_NO',
            align: 'center', render: (text) => <Input value={formData.BUDGET_NO} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        },
        {
            title: 'MC NAME',
            dataIndex: 'BUDGET_NO',
            align: 'center', render: (text) => <Input value={formData.BUDGET_NO} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        },
        {
            title: 'GROUP',
            dataIndex: 'BUDGET_NO',
            align: 'center', render: (text) => <Input value={formData.BUDGET_NO} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        },
        {
            title: 'LOCATION',
            dataIndex: 'BUDGET_NO',
            align: 'center', render: (text) => <Input value={formData.BUDGET_NO} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        },
        {
            title: 'REMARK',
            dataIndex: 'BUDGET_NO',
            align: 'center', render: (text) => <Input value={formData.BUDGET_NO} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        },

    ]

    const datatableColumns = [
        { title: 'ID', dataIndex: 'ID', key: 'ID' },
        { title: 'DPM', dataIndex: 'DPM', key: 'DPM' },
        { title: 'PART NO.', dataIndex: 'PART_NO', key: 'PART_NO' },
        { title: 'SPEC', dataIndex: 'SPEC', key: 'SPEC' },
        { title: 'PRICE', dataIndex: 'PRICE', key: 'PRICE' },
        { title: 'CURR', dataIndex: 'CURR', key: 'CURR' },
        { title: 'UNIT', dataIndex: 'UNIT', key: 'UNIT' },
        { title: 'PD', dataIndex: 'PD', key: 'PD' },
        { title: 'MC NAME', dataIndex: 'MC_NAME', key: 'MC_NAME' },
        { title: 'LOCATION', dataIndex: 'LOCATION', key: 'LOCATION' },
        { title: 'STOCK', dataIndex: 'STOCK', key: 'STOCK' },
        { title: 'REMARKS', dataIndex: 'REMARKS', key: 'REMARKS' },
        { title: 'CCC NAME ', dataIndex: "CCC_NAME", key: "CCC_NAME" },
        { title: "GROUP", dataIndex: "GROUP", key: "GROUP" }
    ]

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">SPARE PART</h2>

                {loading_30 ? (
                    <Spin size="large" />
                ) : (
                    <Select
                        value={formData.CCC_NAME}
                        placeholder='Select CCC'
                        align='center'
                        onChange={(value) => setFormData({ ...formData, CCC_NAME: value })}
                    >
                        {data_30 && data_30.map(item => (
                            <Select.Option key={item.ID} value={item.ID}>{item.CCC_NAME}</Select.Option>
                        ))}
                    </Select>
                )}

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <Table columns={columns} dataSource={[formData]} pagination={false} />
                        <Button className='btn btn-sm btn-neutral'>REVISE</Button>
                    </div>
                </div>

                {/* Datatable */}
                {
                    loading_24 ? (
                        <Spin size="large" />
                    ) : (
                        <Table columns={datatableColumns} dataSource={data_24} rowKey="ID" pagination={{ pageSize: 10 }} />
                    )
                }

            </div>
        </div>
    )
}