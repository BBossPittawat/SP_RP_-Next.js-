'use client'
import useStore from '@/lib/store'
import { useState, useEffect } from 'react'
import { Table, Upload, Button, Input, Select } from 'antd'
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

export default function Spare_part({ department }) {

    const {
        data_24,
        loading_24,
        fetchData_24,
        data_25,
        // loading_25,
        fetchData_25,
        data_26,
        // loading_26,
        fetchData_26,
        fetchData_27
    } = useStore()

    const [tableData, setTableData] = useState([])
    const [changedRows, setChangedRows] = useState(new Set())
    const [selectedCCC, setSelectedCCC] = useState(null)
    const [showSubmitButton, setShowSubmitButton] = useState(false)

    useEffect(() => {
        if (!data_24 && department) fetchData_24(department)
    }, [department])

    useEffect(() => {
        setTableData(data_24 || [])
    }, [data_24])

    const handleInputChange = (e, record, field) => {
        const newValue = e.target.value
        const newData = tableData.map(item => {
            if (item.ID === record.ID) {
                item[field] = newValue
                changedRows.add(record.ID)
            }
            return item
        })
        setTableData(newData)
        setChangedRows(new Set(changedRows))
        setShowSubmitButton(true)
    }

    const handleSelectChange = (value, record, field) => {
        const newData = tableData.map(item => {
            if (item.ID === record.ID) {
                item[field] = value
                if (field === 'PD') item['MC_NAME'] = ''
                changedRows.add(record.ID)
            }
            return item
        })

        setTableData(newData)
        setChangedRows(new Set(changedRows))
        setShowSubmitButton(true)

        if (field === 'PD') handleSelectChange('', record, 'MC_NAME')

    }

    const handleUploadChange = ({ fileList }, record) => {
        const file = fileList.length > 0 ? fileList[0].originFileObj : null

        setTableData(prev => prev.map(item => item.ID === record.ID ? { ...item, img: file } : item))

        changedRows.add(record.ID)
        setChangedRows(new Set(changedRows))
        setShowSubmitButton(true)
    }

    const getColumnFilters = (dataIndex) => [...new Set(tableData.map(item => item[dataIndex]))].map(value => ({ text: value, value }))

    const handleCCCChange = async (value) => {
        setSelectedCCC(value)

        if (value) {
            setTableData(data_24.filter(item => item.CCC_NAME === value))
            await fetchData_25(department)
            await fetchData_26()
        } else setTableData([])

    }

    const getPdOptions = () => [...new Set(data_25?.map(item => item.PD))].map(pd => ({ label: pd, value: pd }))

    const getMcNameOptions = (selectedPd) => data_25?.filter(item => item.PD === selectedPd).map(item => ({ label: item.MC_NAME, value: item.MC_NAME }))

    const columns = [
        {
            title: 'Upload IMG.',
            key: 'addImage',
            align: 'center',
            render: (_, record) => {
                const uploadedFile = tableData.find(item => item.ID === record.ID)?.img
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
            title: 'IMG Status',
            key: 'imgStatus',
            align: 'center',
            render: (_, record) => data_24.find(item => item.ID === record.ID)?.IMG
                ? <CheckCircleOutlined style={{ color: 'green' }} />
                : <CloseCircleOutlined style={{ color: 'red' }} />
        },

        { title: 'PART NO', dataIndex: 'PART_NO', key: 'PART_NO', filters: getColumnFilters('PART_NO'), onFilter: (value, record) => record.PART_NO?.includes(value), align: 'center', width: 150 },
        {
            title: 'SPEC', dataIndex: 'SPEC', key: 'SPEC', filters: getColumnFilters('SPEC'), onFilter: (value,
                record) => record.SPEC?.includes(value), align: 'center',
            width:
                150
        },
        {
            title: "PD", dataIndex: "PD", key: "PD", filters: getColumnFilters("PD"), onFilter: (value,
                record) => record.PD?.includes(value), align: "center", width:
                150,
            render: (text,
                record) => (<Select value={text} options={getPdOptions()} onChange={(value) => handleSelectChange(value,
                    record, "PD")} style={{ width: "100%" }} />)
        },
        {
            title: "MC NAME", dataIndex: "MC_NAME", key: "MC_NAME", filters: getColumnFilters("MC_NAME"), onFilter: (value,
                record) => record.MC_NAME?.includes(value), align: "center", width:
                200,
            render: (text,
                record) => (<Select value={text} options={getMcNameOptions(record.PD)} onChange={(value) => handleSelectChange(value,
                    record, "MC_NAME")} style={{ width: "100%" }} />)
        },
        {
            title: "GROUP", dataIndex: "GROUP", key: "GROUP", filters: getColumnFilters("GROUP"), onFilter: (value, record) => record.GROUP?.includes(value), align: "center", width: 150,
            render: (text, record) => (
                <Select
                    value={text}
                    options={data_26?.map(item => ({ label: item.GROUP, value: item.GROUP })) || []}
                    onChange={(value) => handleSelectChange(value, record, "GROUP")}
                    style={{ width: "100%" }}
                />
            )
        },
        {
            title: "LOCATION", dataIndex: "LOCATION", key: "LOCATION", align:
                "center",
            width:
                50,
            render: (text,
                record) => (<Input value={text} onChange={(e) => handleInputChange(e,
                    record, "LOCATION")} style={{
                        textAlign:
                            "center"
                    }} />)
        },
        {
            title: "REMARK", dataIndex: "REMARK", key: "REMARK", align:
                "center",
            render: (text,
                record) => (<Input value={text} onChange={(e) => handleInputChange(e,
                    record, "REMARK")} style={{
                        textAlign:
                            "center"
                    }} />)
        }
    ]

    const handleSubmit = async () => {
        const changedData = [...changedRows].map(id => {
            const item = tableData.find(record => record.ID === id)
            return {
                id: item.ID,
                product: item.PD,
                machine: item.MC_NAME,
                group: item.GROUP,
                location: item.LOCATION,
                remark: item.REMARK,
                img: item.img
            }
        })

        try {
            for (const data of changedData) {
                const formData = new FormData()
                Object.keys(data).forEach(key => formData.append(key, data[key]))

                await fetchData_27(formData)
            }

            setChangedRows(new Set())
            setShowSubmitButton(false)
            await fetchData_24(department)
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">SPARE PART</h2>

                    <div className="flex justify-between items-center">
                        <Select className='mt-2' showSearch placeholder="CCC" optionFilterProp="label" style={{
                            width:
                                100, borderRadius: '15px'
                        }} options={getColumnFilters('CCC_NAME')} onChange={handleCCCChange} />
                        {showSubmitButton && (<button className="btn btn-primary" onClick={handleSubmit}>SUBMIT</button>)}
                    </div>

                    {selectedCCC && (<Table columns={columns} dataSource={tableData} loading=
                        {loading_24} rowKey=
                        "ID"
                        pagination=
                        {false}
                        rowClassName={(record) => changedRows.has(record.ID) ? "bg-yellow-200" : ""} />)}
                </div>
            </div>
        </>
    )
}