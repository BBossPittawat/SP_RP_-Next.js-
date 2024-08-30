'use client'
import useStore from '@/lib/store'
import { useState, useEffect } from 'react'
import { Table, Button, Popconfirm } from 'antd'
import moment from 'moment'
import { ReloadOutlined } from '@ant-design/icons'
import { saveAs } from 'file-saver'


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

    const convertToCSV = (data) => {
        return data.map(record => {
            const currentDate = moment().format('DDMMYY');
            return [
                record.CCC_NAME,
                record.CCC_ISSU_TO,
                '',
                '',
                `'${currentDate}`,
                '',
                record.PART_NO,
                '',
                record.QTY,
                '',
                '',
                '',
                '',
                '',
                record.UNIT,
                '',
                '',
                record.ACC,
                '',
                '',
                '',
                '',
                '',
                `'SPRP-${record.ID}`
            ].join(',');
        }).join('\n');
    }

    const handleAllCIPayout = async () => {
        setAllCIPayoutLoading(true);

        const csvData = data_19.map(record => {
            const date_ci_format = moment().format('DDMMYY')

            const update_req_jdm = {
                id: record.ID,
                jdm_status: 1
            }

            fetchData_21(update_req_jdm)

            return {
                ...record,
                COMMENT: `SPRP-${record.ID}`
            };
        });

        const csvContent = convertToCSV(csvData)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        saveAs(blob, 'SPRP_CI_PAYOUT.csv')

        await fetchData_19(department)
        setAllCIPayoutLoading(false)
        await fetchData_19(department)
    }


    // const handleAllCIPayout = async () => {
    //     setAllCIPayoutLoading(true)
    //     for (const record of data_19) {
    //         handleCIPayout(record)
    //     }
    //     setAllCIPayoutLoading(false)
    // }

    // const handleCIPayout = (record) => {

    //     const date_ci_format = moment(record.DTE_REQ).format('DDMMYY')
    //     const cm_ci_format = `SPRP.ID.${record.ID}`

    //     // const requestData = {
    //     //     ccc: record.CCC_NAME,
    //     //     ccc_issue_to: record.CCC_ISSU_TO,
    //     //     tran_date: date_ci_format,
    //     //     part_no: record.PART_NO,
    //     //     qty: record.QTY,
    //     //     unit: record.UNIT,
    //     //     ac_title: record.ACC,
    //     //     comment: cm_ci_format
    //     // }

    //     const update_req_jdm = {
    //         id: record.ID,
    //         jdm_status: 1
    //     }

    //     if (requestData) {
    //         // fetchData_20(requestData)
    //         fetchData_21(update_req_jdm)
    //         fetchData_19(department)
    //     }

    // }


    const handleReject = async (record) => {

        const update_req_jdm = {
            id: record.ID,
            jdm_status: 2
        }

        if (update_req_jdm) {
            fetchData_21(update_req_jdm)
            await fetchData_19(department)
            await fetchData_19(department)
        }

    }

    const columns = [
        {
            title: <div style={{ fontSize: '10px' }}>CCC FROM</div>,
            dataIndex: 'CCC_NAME',
            key: 'CCC_NAME',
            filters: getColumnFilters('CCC_NAME'),
            onFilter: (value, record) => record.CCC_NAME.includes(value),
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '10px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '10px' }}>PD FROM</div>,
            dataIndex: 'PD_FROM',
            key: 'PD_FROM',
            filters: getColumnFilters('PD_FROM'),
            onFilter: (value, record) => record.PD_FROM && record.PD_FROM.includes(value),
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '10px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '10px' }}>CCC TO</div>,
            dataIndex: 'CCC_ISSU_TO',
            key: 'CCC_ISSU_TO',
            filters: getColumnFilters('CCC_ISSU_TO'),
            onFilter: (value, record) => record.CCC_ISSU_TO && record.CCC_ISSU_TO.includes(value),
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '10px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '10px' }}>PD TO</div>,
            dataIndex: 'PRODUCT',
            key: 'PRODUCT',
            filters: getColumnFilters('PRODUCT'),
            onFilter: (value, record) => record.PRODUCT && record.PRODUCT.includes(value),
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '10px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '10px' }}>ACC</div>,
            dataIndex: 'ACC',
            key: 'ACC',
            filters: getColumnFilters('ACC'),
            onFilter: (value, record) => record.ACC === value,
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '10px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '10px' }}>BUDGET PERIOD</div>,
            dataIndex: 'BUDGET_PERIOD',
            key: 'BUDGET_PERIOD',
            filters: getColumnFilters('BUDGET_PERIOD'),
            onFilter: (value, record) => record.BUDGET_PERIOD && record.BUDGET_PERIOD.includes(value),
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '10px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '10px' }}>BUDGET NO.</div>,
            dataIndex: 'BUDGET_NO',
            key: 'BUDGET_NO',
            filters: getColumnFilters('BUDGET_NO'),
            onFilter: (value, record) => record.BUDGET_NO && record.BUDGET_NO.includes(value),
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '10px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '10px' }}>PART NAME</div>,
            key: 'PART_NAME',
            align: 'center',
            width: 30,
            render: (text, record) => (
                <div style={{ fontSize: '10px' }}>
                    <span style={{ color: 'black' }}>{record.PART_NO}</span><br />
                    <span style={{ color: 'gray' }}>{record.SPEC}</span>
                </div>
            ),
            filters: getColumnFilters('PART_NO').concat(getColumnFilters('SPEC')),
            onFilter: (value, record) => record.PART_NO.includes(value) || record.SPEC.includes(value)
        },
        {
            title: <div style={{ fontSize: '10px' }}>QTY</div>,
            dataIndex: 'QTY',
            key: 'QTY',
            filters: getColumnFilters('QTY'),
            onFilter: (value, record) => record.QTY === value,
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '10px' }}>{text}</div>
        },
        // {
        //     title: <div style={{ fontSize: '12px' }}>Unit</div>,
        //     dataIndex: 'UNIT',
        //     key: 'UNIT',
        //     filters: getColumnFilters('UNIT'),
        //     onFilter: (value, record) => record.UNIT.includes(value),
        //     align: 'center',
        //     render: text => <div style={{ fontSize: '12px' }}>{text}</div>
        // },


        {
            title: <div style={{ fontSize: '12px' }}>MC</div>,
            dataIndex: 'MC_NAME',
            key: 'MC_NAME',
            filters: getColumnFilters('MC_NAME'),
            onFilter: (value, record) => record.MC_NAME && record.MC_NAME.includes(value),
            align: 'center',
            width: 10,
            render: text => <div style={{ fontSize: '12px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '12px' }}>MN CODE</div>,
            dataIndex: 'MN_CODE',
            key: 'MN_CODE',
            filters: getColumnFilters('MN_CODE'),
            onFilter: (value, record) => record.MN_CODE.includes(value),
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '12px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '12px' }}>LOC.</div>,
            dataIndex: 'LOCATION',
            key: 'LOCATION',
            filters: getColumnFilters('LOCATION'),
            onFilter: (value, record) => record.LOCATION.includes(value),
            width: 5,
            align: 'center',
            render: text => <div style={{ fontSize: '12px' }}>{text}</div>
        },
        {
            title: <div style={{ fontSize: '12px' }}>REQ.</div>,
            key: 'REQUEST',
            align: 'center',
            width: 15,
            render: (text, record) => (
                <div style={{ fontSize: '12px' }}>
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
            title: <div style={{ fontSize: '12px' }}>REMARK</div>,
            dataIndex: 'REMARK',
            key: 'REMARK',
            filters: getColumnFilters('REMARK'),
            onFilter: (value, record) => record.REMARK.includes(value),
            align: 'center',
            width: 5,
            render: text => <div style={{ fontSize: '12px' }}>{text}</div>
        },
        {
            title: '',
            key: '',
            align: '',
            width: 5,
            render: (text, record) => (
                <div className="flex flex-col items-center space-y-2">
                    {/* <Popconfirm
                        title="Are you sure to CI Pay-out?"
                        onConfirm={() => handleCIPayout(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className='btn btn-sm btn-success'>CI Pay-out</Button>
                    </Popconfirm> */}
                    <Popconfirm
                        title="Are you sure to Reject?"
                        onConfirm={() => handleReject(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className='btn btn-sm btn-error'>RJ.</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]

    const rowClassName = (record, index) => index % 2 === 0 ? "bg-gray-200" : ""

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">

                {/* <button className="btn" onClick={() => document.getElementById('my_modal').showModal()}>Open detail</button>
                <dialog id="my_modal" className="modal modal-fullscreen"> */}
                {/* <div className="modal-box w-full h-full max-w-none"> */}

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
                                Approve &
                                Export CSV
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

                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                    </form>
                </div>
                {/* </div> */}
                {/* </dialog> */}





            </div>

            <style jsx global>{`
                .modal-fullscreen .modal-box {
                    width: 100%;
                    height: 100%;
                    max-width: none;
                }
                .custom-popconfirm .ant-popover-content {
                    z-index: 1050; /* Ensure it is above the modal */
                }
            `}</style>

        </div>


    )
}