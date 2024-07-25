'use client'
import useStore from '@/lib/store'
import { useState, useEffect } from 'react'
import { Table, Upload, Button, Input, Select, Spin } from 'antd'
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { width } from '@mui/system'

export default function Spare_part({ department }) {

    const [editingRow, setEditingRow] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState({})
    const [cccId, setCccId] = useState(null)

    const {
        data_24: Data_TB,
        loading_24: loading_TB,
        fetchData_24: fetch_TB,
        error_24: error_TB,
        data_25: process_data,
        loading_25,
        fetchData_25,
        data_26: ddlGroup,
        loading_26,
        fetchData_26,
        fetchData_27,
        data_30: ddl_ccc,
        loading_30: loading_ddl_ccc,
        fetchData_30: fetch_ddl_ccc,
    } = useStore()

    const [formData, setFormData] = useState({
        ID: 0,
        CCC_NAME: null,
        PART_NO: null,
        SPEC: null,
        PD: null,
        MC_NAME: null,
        GROUP: null,
        LOCATION: null,
        REMARK: null
    })

    useEffect(() => {
        if (!ddl_ccc && department) fetch_ddl_ccc(department)
    }, [department])

    const handleUploadChange = ({ fileList }, record) => {
        const file = fileList.length > 0 ? fileList[0].originFileObj : null
        setUploadedFiles(prev => ({ ...prev, [record.ID]: file }))
        setFormData(prev => ({ ...prev, img: file }))
    }

    const handleEdit = (record) => {
        setEditingRow(record.ID)
        setFormData({
            ID: record.ID,
            PART_NO: record.PART_NO,
            SPEC: record.SPEC,
            PD: record.PD,
            PD_ID: process_data.find(item => item.PD === record.PD)?.PD_ID || null,
            MC_NAME: record.MC_NAME,
            MC_ID: process_data.find(item => item.MC_NAME === record.MC_NAME)?.MC_ID || null,
            GROUP: record.GROUP,
            GROUP_ID: ddlGroup ? ddlGroup.find(group => group.GROUP === record.GROUP)?.GROUP_ID || null : null,
            LOCATION: record.LOCATION,
            REMARK: record.REMARK
        })
        setUploadedFiles(prev => ({ ...prev, [record.ID]: null }))
    }

    const CccChanged = async (value) => {
        setCccId(value)
        await fetch_TB(department, value)
        await fetchData_25(department)
        await fetchData_26()
    }

    const handleRevise = async () => {
        // const ccc_id = value
        const revisedData = {
            id: formData.ID || '',
            product_id: formData.PD_ID || '',
            machine_id: formData.MC_ID || '',
            group_id: formData.GROUP_ID || '',
            location: formData.LOCATION || '',
            remark: formData.REMARK || '',
            img: formData.img || ''
        }

        // Convert revisedData to FormData
        const formRequest = new FormData()
        for (const key in revisedData) {
            if (revisedData[key]) {
                formRequest.append(key, revisedData[key])
            }
        }

        try {

            await fetchData_27(formRequest)
            await fetch_TB(department, cccId)
            setFormData({
                ID: 0,
                PART_NO: null,
                SPEC: null,
                PD: null,
                PD_ID: null,
                MC_NAME: null,
                MC_ID: null,
                GROUP: null,
                GROUP_ID: null,
                LOCATION: null,
                REMARK: null,
                img: null
            })

            setEditingRow(null)
            // console.log("Revise successful")
        } catch (error) {
            console.error("Revise failed", error)
        }
    }

    const uniqueProducts = process_data ? [...new Set(process_data.map(item => item.PD))] : []
    const machineNamesForSelectedProduct = process_data ? process_data.filter(item => item.PD === formData.PD) : []

    const columns = [
        {
            title: 'Upload IMG.',
            key: 'addImage',
            align: 'center',
            render: (_, record) => {
                const uploadedFile = uploadedFiles[record.ID]
                return (
                    <Upload onChange={({ fileList }) => handleUploadChange({ fileList }, record)} showUploadList={false}>
                        <Button icon={<UploadOutlined />} size="small">
                            {uploadedFile ? uploadedFile.name : "Upload"}
                        </Button>
                    </Upload>
                )
            }
        },
        {
            title: 'PART NO.',
            dataIndex: 'PART_NO',
            align: 'center', render: (text) =>
                <Input disabled value={formData.PART_NO}
                    onChange={(e) => setFormData({ ...formData, PART_NO: e.target.value })}
                />
        },
        // {
        //     title: 'SPEC',
        //     dataIndex: 'SPEC',
        //     align: 'center', render: (text) => <Input disabled value={formData.SPEC} onChange={(e) => setFormData({ ...formData, BUDGET_NO: e.target.value })} />
        // },
        {
            title: 'PRODUCT',
            dataIndex: 'PD',
            align: 'center',
            width: 150,
            render: (text) => (
                <Select
                    value={formData.PD}
                    onChange={(value) => {
                        const selectedProduct = process_data.find(item => item.PD === value)
                        setFormData({ ...formData, PD: value, PD_ID: selectedProduct ? selectedProduct.PD_ID : null })
                    }}
                    style={{ width: "100%" }}
                >
                    {uniqueProducts.map(product => (
                        <Select.Option key={product} value={product}>{product}</Select.Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'MC NAME',
            dataIndex: 'MC_NAME',
            align: 'center',
            width: 250,
            render: (text) => (
                <Select
                    value={formData.MC_NAME}
                    onChange={(value) => {
                        const selectedMachine = process_data.find(item => item.MC_NAME === value)
                        setFormData({ ...formData, MC_NAME: value, MC_ID: selectedMachine ? selectedMachine.MC_ID : null })
                    }}
                    style={{ width: "100%" }}
                >
                    {machineNamesForSelectedProduct.map(machine => (
                        <Select.Option key={machine.MC_ID} value={machine.MC_NAME}>{machine.MC_NAME}</Select.Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'GROUP',
            dataIndex: 'GROUP',
            align: 'center',
            width: 150,
            render: (text) => (
                <Select
                    value={formData.GROUP}
                    onChange={(value) => {
                        const selectedGroup = ddlGroup ? ddlGroup.find(group => group.GROUP === value) : null
                        setFormData({ ...formData, GROUP: value, GROUP_ID: selectedGroup ? selectedGroup.GROUP_ID : null })
                    }}
                    style={{ width: "100%" }}
                >
                    {ddlGroup ? ddlGroup.map(group => (
                        <Select.Option key={group.GROUP_ID} value={group.GROUP}>{group.GROUP}</Select.Option>
                    )) : null}
                </Select>
            )
        },
        {
            title: 'LOCATION',
            dataIndex: 'LOCATION',
            width: 100,
            align: 'center',
            render: (text) => (
                <Input
                    value={formData.LOCATION}
                    onChange={(e) => setFormData({ ...formData, LOCATION: e.target.value })}
                />
            )
        },
        {
            title: 'REMARK',
            dataIndex: 'REMARK',
            align: 'center',
            render: (text) => (
                <Input
                    value={formData.REMARK}
                    onChange={(e) => setFormData({ ...formData, REMARK: e.target.value })}
                />
            )
        },

    ]


    const datatableColumns = [
        {
            title: 'CCC NAME',
            dataIndex: "CCC_NAME",
            key: "CCC_NAME",
            align: 'center',
            filters: Data_TB ? [...new Set(Data_TB.map(item => item.CCC_NAME))].map(value => ({ text: value, value })) : [],
            onFilter: (value, record) => record.CCC_NAME.includes(value)
        },
        {
            title: 'IMG Status',
            key: 'imgStatus',
            align: 'center',
            render: (_, record) => Data_TB.find(item => item.ID === record.ID)?.IMG
                ? <CheckCircleOutlined style={{ color: 'green' }} />
                : <CloseCircleOutlined style={{ color: 'red' }} />
        },
        {
            title: 'PART NO.',
            dataIndex: 'PART_NO',
            key: 'PART_NO',
            align: 'center',
            filters: Data_TB ? [...new Set(Data_TB.map(item => item.PART_NO))].map(value => ({ text: value, value })) : [],
            onFilter: (value, record) => record.PART_NO.includes(value)
        },
        {
            title: 'SPEC',
            dataIndex: 'SPEC',
            key: 'SPEC',
            align: 'center',
            filters: Data_TB ? [...new Set(Data_TB.map(item => item.SPEC))].map(value => ({ text: value, value })) : [],
            onFilter: (value, record) => record.SPEC.includes(value)
        },
        {
            title: 'PRODUCT',
            dataIndex: 'PD',
            key: 'PD',
            align: 'center',
            filters:
                Data_TB ? [...new Set(Data_TB.map(item => item.PD))].map(value => ({ text: value, value })) : [],
            onFilter: (value, record) => record.PD.includes(value)
        },
        {
            title: 'MC NAME',
            dataIndex: 'MC_NAME',
            key: 'MC_NAME',
            align: 'center',
            filters:
                Data_TB ? [...new Set(Data_TB.map(item => item.MC_NAME))].map(value => ({ text: value, value })) : [],
            onFilter: (value, record) => record.MC_NAME.includes(value)
        },
        {
            title: "GROUP",
            dataIndex: "GROUP",
            key: "GROUP",
            align: 'center',
            filters:
                Data_TB ? [...new Set(Data_TB.map(item => item.GROUP))].map(value => ({ text: value, value })) : [],
            onFilter: (value, record) => record.GROUP.includes(value)
        },
        {
            title: 'LOCATION',
            dataIndex: 'LOCATION',
            key: 'LOCATION',
            align: 'center',
            filters:
                Data_TB ? [...new Set(Data_TB.map(item => item.LOCATION))].map(value => ({ text: value, value })) : [],
            onFilter: (value, record) => record.LOCATION.includes(value)
        },
        {
            title: 'REMARK',
            dataIndex: 'REMARK',
            key: 'REMARK',
            align: 'center'
        },

        {
            key: "action",
            align: "center",
            render: (text, record) => (
                <Button className='btn btn-sm btn-primary' onClick={() => handleEdit(record)}>EDIT</Button>
            )
        }
    ]


    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">SPARE PART</h2>

                {loading_ddl_ccc ? (
                    <Spin size="large" />
                ) : (
                    <Select
                        // value={formData.CCC_NAME}
                        placeholder='Select CCC'
                        align='center'
                        onChange={(value) => {
                            setFormData({ ...formData, CCC_NAME: value })
                            CccChanged(value)
                        }}
                    >
                        {ddl_ccc && ddl_ccc.map(item => (
                            <Select.Option key={item.ID} value={item.ID}>{item.CCC_NAME}</Select.Option>
                        ))}
                    </Select>
                )}

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <Table columns={columns} dataSource={[formData]} pagination={false} />

                        {editingRow && (
                            <Button onClick={handleRevise} className='btn btn-sm btn-neutral'>REVISE</Button>
                        )}

                    </div>
                </div>

                {/* Datatable */}
                {
                    loading_TB ? (
                        <Spin className='mt-5' size="large" />
                    ) : (
                        Data_TB && !error_TB ? (
                            <Table columns={datatableColumns} dataSource={Data_TB} rowKey='ID' pagination={{ pageSize: 10 }} />
                        ) : null
                    )
                }

            </div>
        </div>
    )
}