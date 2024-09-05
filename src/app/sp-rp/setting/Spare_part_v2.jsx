'use client'
import useStore from '@/lib/store'
import { useState, useEffect, useRef } from 'react'
import { Table, Upload, Button, Input, Select, Spin, Progress } from 'antd'
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export default function Spare_part({ department }) {

    const modalRef = useRef(null)

    const [editingRow, setEditingRow] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState({})
    const [cccId, setCccId] = useState(null)
    const [attachedFile, setAttachedFile] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [fileInputValue, setFileInputValue] = useState('')
    const [progress, setProgress] = useState(0)

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
        data_39: data_pd_mc,
        loading_39: loading_pd_mc,
        fetchData_39: fetch_pd_mc,
        data_40,
        loading_40,
        fetchData_40,
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
    }, [department, ddl_ccc, fetch_ddl_ccc])

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
        await fetch_pd_mc(department)
    }

    // console.log(data_pd_mc)

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

    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Spare Parts')
        const worksheet2 = workbook.addWorksheet('PD & Machine list')
        const worksheet3 = workbook.addWorksheet('Group list')

        worksheet.columns = [
            { header: 'ID', key: 'ID', width: 5 },
            { header: 'CCC', key: 'CCC_NAME', width: 10 },
            { header: 'IMG STATUS', key: 'IMG_STATUS', width: 10 },
            { header: 'PART NO.', key: 'PART_NO', width: 25 },
            { header: 'SPEC', key: 'SPEC', width: 35 },
            { header: 'PRODUCT', key: 'PD', width: 15 },
            { header: 'MC NAME', key: 'MC_NAME', width: 30 },
            { header: 'GROUP', key: 'GROUP', width: 15 },
            { header: 'LOCATION', key: 'LOCATION', width: 10 },
            { header: 'REMARK', key: 'REMARK', width: 20 }
        ]

        Data_TB.forEach(item => {
            worksheet.addRow({
                ID: item.ID,
                CCC_NAME: item.CCC_NAME,
                IMG_STATUS: item.IMG ? 'Available' : '-',
                PART_NO: item.PART_NO,
                SPEC: item.SPEC,
                PD: item.PD,
                MC_NAME: item.MC_NAME,
                GROUP: item.GROUP,
                LOCATION: item.LOCATION,
                REMARK: item.REMARK
            })
        })

        worksheet.columns.forEach(column => {
            column.alignment = {
                vertical: 'middle',
                horizontal: 'center'
            }
        })

        worksheet.eachRow({ includeEmpty: true }, row => {
            row.eachCell(cell => {
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                }
            })
        })
        // --------------------------------------------------------------------------- worksheet 2
        worksheet2.columns = [
            { header: 'PRODUCT', key: 'PRODUCT', width: 15 },
            { header: 'MACHINE', key: 'MACHINE', width: 30 }
        ]

        if (data_pd_mc) {
            data_pd_mc.forEach(item => {
                worksheet2.addRow({
                    PRODUCT: item.PRODUCT,
                    MACHINE: item.MACHINE
                })
            })
        }

        worksheet2.columns.forEach(column => {
            column.alignment = {
                vertical: 'middle',
                horizontal: 'center'
            }
        })

        // --------------------------------------------------------------------------- worksheet 3

        worksheet3.columns = [
            { header: 'GROUP', key: 'GROUP', width: 15 },
        ]

        if (ddlGroup) {
            ddlGroup.forEach(item => {
                worksheet3.addRow({
                    GROUP: item.GROUP,
                })
            })
        }

        // ---------------------------------------------------------------------------

        await worksheet.protect('P7aIfwlR8dbGMRn')
        await worksheet2.protect('P7aIfwlR8dbGMRn')
        await worksheet3.protect('P7aIfwlR8dbGMRn')

        for (let i = 1; i <= worksheet.columns.length; i++) {
            if (i > 5) {
                worksheet.getColumn(i).eachCell(cell => {
                    cell.protection = {
                        locked: false
                    }
                })
            }
        }

        const cccName = ddl_ccc.find(item => item.ID === cccId)?.CCC_NAME || 'spare_part'
        const filename = `${cccName}_spare_part.xlsx`

        workbook.xlsx.writeBuffer().then(buffer => {
            saveAs(new Blob([buffer]), filename)
        })
    }

    const handleUpdate = async () => {
        if (!attachedFile) return;

        setIsUpdating(true);
        setProgress(0);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const buffer = e.target.result;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            const worksheet1 = workbook.getWorksheet(1);

            let completedCalls = 0;
            const totalCalls = worksheet1.actualRowCount - 1;

            worksheet1.eachRow(async (row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row

                let requestData = {
                    id: row.getCell('A').value,
                    ccc: row.getCell('B').value,
                    product: row.getCell('F').value || '0',
                    machine: row.getCell('G').value || '0',
                    group: row.getCell('H').value || '0',
                    location: row.getCell('I').value || '0',
                    remark: row.getCell('J').value || '0',
                }

                try {
                    await fetchData_40(requestData)
                    completedCalls++

                    setProgress((completedCalls / totalCalls) * 100)

                    if (completedCalls === totalCalls) {
                        setIsUpdating(false)
                        setAttachedFile(null)
                        setFileInputValue('')

                        if (modalRef.current) {
                            modalRef.current.close()
                        }

                        await fetch_TB(department, cccId);
                    }
                } catch (error) {
                    console.error("Error in fetchData_40:", error)
                }
            });
        };
        reader.readAsArrayBuffer(attachedFile);
    }

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

                {cccId && ddl_ccc.find(item => item.ID === cccId)?.CCC_NAME && data_pd_mc &&
                    <button className="btn btn-sm btn-neutral" onClick={() => document.getElementById('my_modal_1').showModal()}>Multiple data management</button>
                }

                <dialog id="my_modal_1" className="modal" ref={modalRef}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-5">SPARE PART</h3>

                        <button className="btn btn-sm btn-primary w-full" onClick={handleExport}>
                            Export [ ดาวน์โหลดข้อมูล ]
                        </button>

                        <h3 className="font-bold text-ls mt-5">Import [ นำเข้าข้อมูล ]</h3>

                        <input
                            type="file"
                            className="mt-1 file-input file-input-sm file-input-bordered file-input-accent w-full"
                            value={fileInputValue}
                            onChange={(e) => {
                                setAttachedFile(e.target.files[0])
                                setFileInputValue(e.target.value)
                            }}
                        />

                        <div className="modal-action">
                            {isUpdating ? (
                                <Progress className='mt-3' percent={Math.round(progress)} />
                            ) : (
                                attachedFile && (
                                    <button className="btn btn-accent me-3" onClick={handleUpdate}>Update</button>
                                )
                            )}

                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>

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