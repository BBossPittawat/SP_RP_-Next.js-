'use client'
import useStore from '@/lib/store'
import { useState, useEffect } from 'react'
import { Table, Button, Popconfirm } from 'antd'
import moment from 'moment'
import { ReloadOutlined } from '@ant-design/icons';

export default function Ci_payout({ department }) {
    const {
        data_19,
        loading_19,
        error_19,
        fetchData_19,
        // data_20,
        // loading_20,
        fetchData_20,
        // data_21,
        // loading_21,
        fetchData_21
    } = useStore()

    const [allCIPayoutLoading, setAllCIPayoutLoading] = useState(false)

    useEffect(() => {
        if (!data_19 && department) fetchData_19(department)
    }, [department])

    const getColumnFilters = (dataIndex) => {
        if (!data_19) return []
        const uniqueValues = [...new Set(data_19.map(item => item[dataIndex]))]
        return uniqueValues.map(value => ({ text: value, value }))
    }

    const handleAllCIPayout = async () => {
        setAllCIPayoutLoading(true)
        for (const record of data_19) {
            handleCIPayout(record)
        }
        setAllCIPayoutLoading(false)
    }

    const handleCIPayout = (record) => {

        const date_ci_format = moment(record.DTE_REQ).format('DDMMYY')
        const cm_ci_format = `SPRP.ID.${record.ID}`

        const requestData = {
            ccc: record.CCC_NAME,
            ccc_issue_to: record.CCC_ISSU_TO,
            tran_date: date_ci_format,
            part_no: record.PART_NO,
            qty: record.QTY,
            unit: record.UNIT,
            ac_title: record.ACC,
            comment: cm_ci_format
        }

        const update_req_jdm = {
            id: record.ID,
            jdm_status: 1
        }

        if (requestData) {
            fetchData_20(requestData)
            fetchData_21(update_req_jdm)
            fetchData_19(department)
        }

    }


    const handleReject = (record) => {

        const update_req_jdm = {
            id: record.ID,
            jdm_status: 2
        }

        if (update_req_jdm) {
            fetchData_21(update_req_jdm)
            fetchData_19(department)
        }

    }

    const columns = [
        {
            title: 'CCC',
            dataIndex: 'CCC_NAME',
            key: 'CCC_NAME',
            filters: getColumnFilters('CCC_NAME'),
            onFilter: (value, record) => record.CCC_NAME.includes(value),
            align: 'center'
        },
        {
            title: 'PART NAME',
            key: 'PART_NAME',
            align: 'center',
            render: (text, record) => (
                <div>
                    <span style={{ color: 'black' }}>{record.PART_NO}</span><br />
                    <span style={{ color: 'gray' }}>{record.SPEC}</span>
                </div>
            ),
            filters: getColumnFilters('PART_NO').concat(getColumnFilters('SPEC')),
            onFilter: (value, record) => record.PART_NO.includes(value) || record.SPEC.includes(value)
        },
        {
            title: 'Quantity',
            dataIndex: 'QTY',
            key: 'QTY',
            filters: getColumnFilters('QTY'),
            onFilter: (value, record) => record.QTY === value,
            align: 'center'
        },
        {
            title: 'Unit',
            dataIndex: 'UNIT',
            key: 'UNIT',
            filters: getColumnFilters('UNIT'),
            onFilter: (value, record) => record.UNIT.includes(value),
            align: 'center'
        },
        {
            title: 'CCC ISSUE TO',
            dataIndex: 'CCC_ISSU_TO',
            key: 'CCC_ISSU_TO',
            filters: getColumnFilters('CCC_ISSU_TO'),
            onFilter: (value, record) => record.CCC_ISSU_TO && record.CCC_ISSU_TO.includes(value),
            align: 'center'
        },
        {
            title: 'MC',
            dataIndex: 'MC_NAME',
            key: 'MC_NAME',
            filters: getColumnFilters('MC_NAME'),
            onFilter: (value, record) => record.MC_NAME && record.MC_NAME.includes(value),
            align: 'center'
        },
        {
            title: 'MN CODE',
            dataIndex: 'MN_CODE',
            key: 'MN_CODE',
            filters: getColumnFilters('MN_CODE'),
            onFilter: (value, record) => record.MN_CODE.includes(value),
            align: 'center'
        },
        {
            title: 'ACC',
            dataIndex: 'ACC',
            key: 'ACC',
            filters: getColumnFilters('ACC'),
            onFilter: (value, record) => record.ACC === value,
            align: 'center'
        },
        {
            title: 'LOC.',
            dataIndex: 'LOCATION',
            key: 'LOCATION',
            filters: getColumnFilters('LOCATION'),
            onFilter: (value, record) => record.LOCATION.includes(value),
            align: 'center'
        },
        {
            title: 'REQUEST',
            key: 'REQUEST',
            align: 'center',
            render: (text, record) => (
                <div>
                    <span>{moment(record.DTE_REQ).format('DD-MMM-YY HH:mm')}</span><br />
                    <span>{record.REQ_PIC} [{record.EMP_NAME}]</span>
                </div>
            ),
            filters: getColumnFilters('DTE_REQ').concat(getColumnFilters('REQ_PIC')).concat(getColumnFilters('EMP_NAME')),
            onFilter: (value, record) =>
                moment(record.DTE_REQ).format('DD-MMM-YY HH:mm').includes(value) ||
                String(record.REQ_PIC).includes(value) ||
                record.EMP_NAME.includes(value)
        },
        {
            title: '',
            key: '',
            align: '',
            render: (text, record) => (
                <div className="flex flex-col items-center space-y-2">
                    <Popconfirm
                        title="Are you sure to CI Pay-out?"
                        onConfirm={() => handleCIPayout(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className='btn btn-sm btn-success'>CI Pay-out</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Are you sure to Reject?"
                        onConfirm={() => handleReject(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className='btn btn-sm btn-error'>Reject</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]

    const rowClassName = (record, index) => index % 2 === 0 ? "bg-gray-200" : ""

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <h2 className="card-title">CI Payout</h2>
                        <button className="btn btn-sm btn-warning" onClick={() => fetchData_19(department)}>
                            <ReloadOutlined />
                            Refresh
                        </button>
                    </div>
                    <Popconfirm
                        title="Are you sure to CI Pay-out all?"
                        onConfirm={handleAllCIPayout}
                        okText="Yes"
                        cancelText="No"
                    >
                        {data_19 &&
                            <button className={`btn btn-primary ${allCIPayoutLoading ? 'loading' : ''}`}>
                                All CI-Payout
                            </button>
                        }
                    </Popconfirm>
                </div>
                <Table
                    className='mt-2'
                    columns={columns}
                    dataSource={error_19 ? [] : data_19}
                    loading={loading_19}
                    rowKey="ID"
                    rowClassName={rowClassName}
                />
            </div>
        </div>
    )
}