'use client'
import { Tabs, Alert, Result } from 'antd'
import { useState, useEffect } from 'react'
import useStore from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function Req_mn({ data, fetchData_10 }) {

    const [quantity, setQuantity] = useState('')
    const [dept, setDept] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedCcc, setSelectedCcc] = useState('')
    const [selectedMachine, setSelectedMachine] = useState('')
    const [selectedMnCode, setSelectedMnCode] = useState('')
    const [selectedMnAcc, setSelectedMnAcc] = useState('')
    const [remark, setRemark] = useState('')
    const part_id = data[0].ID
    const [formSubmitted, setFormSubmitted] = useState(false)

    const router = useRouter()
    const {
        data_3: productsData,
        fetchData_3: fetchProducts,
        data_4: jwtData,
        error_4: errorJWT,
        // fetchData_4: fetchJWT,
        data_5: machinesData,
        error_5: errorMachines,
        fetchData_5: fetchMachines,
        // data_11: submitsData,
        fetchData_11: submitRequest,
        // error_11: errorSubmit,
        data_12: IndirectData,
        fetchData_12: fetchIndirect,
        // error_12: errorIndirect,
        data_13: mnCodeData,
        fetchData_13: fetchMnCodes,
        // data_14: submitsDataIndirect,
        fetchData_14: submitRequestIndirect,
        // error_14: errorSubmitIndirect,
    } = useStore()

    useEffect(() => {
        if (errorJWT || (jwtData && jwtData.payload && !jwtData.payload.section)) {
            router.push('/sp-rp')
            return
        }

        if (jwtData && jwtData.payload && jwtData.payload.section) {
            const dept = jwtData.payload.section.substring(0, 3) + '00'
            setDept(dept)
            fetchProducts(dept)
            fetchIndirect(dept)
            fetchMnCodes()
        }
    }, [errorJWT, jwtData, router, fetchProducts, fetchIndirect, fetchMnCodes])

    const onProductChange = (e) => {
        const [product, ccc] = e.target.value.split('|')
        setSelectedCcc(ccc)
        setSelectedProduct(product)
        setSelectedMachine('')
        fetchMachines(dept, product)
    }

    const onMnCodeChange = (e) => {
        const [id, acc] = e.target.value.split('|')
        setSelectedMnCode(id)
        setSelectedMnAcc(acc)
    }

    const [SubmitLoading, setSubmitLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    // Production condition
    const handlePdSubmit = async (e) => {
        e.preventDefault()
        setSubmitLoading(true)
        setErrorMessage('')

        let requestData = {
            emp_code: jwtData.payload.emp_code,
            req_type_id: 1,
            product_id: selectedProduct,
            machine_id: selectedMachine,
            mn_code_id: selectedMnCode,
            acc: selectedMnAcc,
            ccc: selectedCcc,
            qty: quantity,
            remark,
            part_id
        }

        if (
            !requestData.emp_code || requestData.emp_code == "" ||
            !requestData.req_type_id || requestData.req_type_id == "" ||
            !requestData.product_id || requestData.product_id == "" ||
            !requestData.machine_id || requestData.machine_id == "" ||
            !requestData.mn_code_id || requestData.mn_code_id == "" ||
            !requestData.qty || requestData.qty == "" ||
            !requestData.remark || requestData.remark == "" ||
            !requestData.part_id || requestData.part_id == ""
        ) {

            setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน")
            setSubmitLoading(false)
            return
        }

        try {
            await submitRequest(requestData)

            setFormSubmitted(true)
            setSubmitLoading(false)

            setSelectedProduct('')
            setSelectedMachine('')
            setSelectedMnCode('')
            setQuantity('')
            setRemark('')

            return

        } catch (error) {
            console.error('Error:', errorMessage)

        }

        setSubmitLoading(false)
    }

    const RefreshPdSubmit = async (e) => {
        setFormSubmitted(false)
        setErrorMessage('')

        if (formSubmitted) (
            fetchData_10(data[0].ID)
        )

    }

    // Indirect condition
    const handleIdrSubmit = async (e) => {
        e.preventDefault()
        setSubmitLoading(true)
        setErrorMessage('')

        let requestData = {
            emp_code: jwtData.payload.emp_code,
            req_type_id: 2,
            ccc: IndirectData[0].CCC,
            // product_id: selectedProduct,
            // machine_id: selectedMachine,
            budget_id: IndirectData[0].BUDGET_ID,
            mn_code_id: selectedMnCode,
            acc: selectedMnAcc,
            qty: quantity,
            remark,
            part_id
        }

        if (
            !requestData.emp_code || requestData.emp_code == "" ||
            !requestData.req_type_id || requestData.req_type_id == "" ||
            !requestData.mn_code_id || requestData.mn_code_id == "" ||
            !requestData.qty || requestData.qty == "" ||
            !requestData.remark || requestData.remark == "" ||
            !requestData.part_id || requestData.part_id == "" ||
            !requestData.budget_id
        ) {

            setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน")
            setSubmitLoading(false)
            return
        }

        try {
            await submitRequestIndirect(requestData)

            setFormSubmitted(true)
            setSubmitLoading(false)

            setSelectedProduct('')
            setSelectedMachine('')
            setSelectedMnCode('')
            setQuantity('')
            setRemark('')

            return

        } catch (error) {
            console.error('Error:', errorMessage)

        }

        setSubmitLoading(false)
    }

    return (
        <>
            <h3 className="text-lm mt-3 text-yellow-600">FORMAT : M/N </h3>

            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="PRODUCTION" key="1">
                    {/* ----------------------------------------------------------------------- PRODUCTION */}
                    {!formSubmitted ? (
                        <>
                            <select onChange={onProductChange} className="select select-bordered w-full mt-3">
                                <option disabled selected value="">Product (พื้นที่การผลิตที่จะนำไปใช้งาน)</option>
                                {productsData && productsData.map((item) => (
                                    <option key={item.id} value={`${item.id}|${item.ccc}`}>{item.product} &nbsp; ( {item.ccc} ) </option>
                                ))}
                            </select>

                            <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} className="select select-bordered w-full mt-3">
                                <option disabled selected value=''>Machine [ เครื่องจักร ]</option>
                                {errorMachines ? (
                                    <option value='no-data'>No Data</option>
                                ) : (
                                    machinesData && machinesData.map((item) => (
                                        <option key={item.id} value={item.id}>{item.machine}</option>
                                    ))
                                )}
                            </select>

                            <select value={selectedMnCode ? `${selectedMnCode}|${selectedMnAcc}` : ''} onChange={onMnCodeChange} className="select select-bordered w-full mt-3">
                                <option value='' disabled selected>M/N Code</option>
                                {mnCodeData && mnCodeData.slice(0, 3).map((mn) => (
                                    <option key={mn.ID} value={`${mn.ID}|${mn.ACC}`}>{mn.MN_CODE} [ {mn.MEAN_TH} ]</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder={`QTY [ จำนวน ] (Max: ${data ? data[0].STOCK : ''})`}
                                value={quantity}
                                onChange={(e) => {
                                    let value = e.target.value
                                    if (value < 1) value = 1
                                    if (value > data[0].STOCK) value = data[0].STOCK
                                    setQuantity(value)
                                }}
                                className="input input-bordered w-full mt-3"
                            />

                            <input type="text" placeholder="หมายเหตุ หรือ ระบุไลน์การผลิตที่จะนำไปใช้งาน" value={remark} onChange={(e) => setRemark(e.target.value)} className="input input-bordered w-full mt-3" />

                        </>
                    ) : (
                        <>
                            <Result status="success" title="เบิกพาร์ทสำเร็จ!" />
                        </>
                    )}

                    <div className='modal-action'>
                        <form method='dialog'>
                            <button className='btn' onClick={RefreshPdSubmit} >Close</button>
                        </form>

                        {!SubmitLoading ? (
                            <>
                                {!formSubmitted &&
                                    <button className='btn btn-primary ml-3' onClick={handlePdSubmit}>เบิกพาร์ท</button>
                                }

                            </>
                        ) : (
                            <button className="ml-3 text-gray-500 text-xl font-bold">
                                <span className="loading loading-spinner"></span> LOADING...
                            </button>
                        )}

                    </div>

                    {errorMessage &&
                        <Alert className='mt-2' message={errorMessage} type="error" showIcon>
                        </Alert>
                    }

                    {/* ------------------------------------------------------------------------------------------ */}
                </Tabs.TabPane>

                <Tabs.TabPane tab="INDIRECT" key="2">
                    {/* ---------------------------------------------------------------------------- INDIRECT */}

                    {!formSubmitted ? (
                        <>

                            {IndirectData && IndirectData.length > 0 && (
                                <>
                                    <input type="text" placeholder={`CCC : ${IndirectData[0].CCC || ''}`} className="input input-bordered w-full mt-3" disabled />
                                    <input type="text" placeholder={`Budget no. : ${IndirectData[0].BUDGET_NO || ''}`} className="input input-bordered w-full mt-3" disabled />
                                </>
                            )}

                            <select value={selectedMnCode ? `${selectedMnCode}|${selectedMnAcc}` : ''} onChange={onMnCodeChange} className="select select-bordered w-full mt-3">
                                <option value='' disabled selected>M/N Code</option>
                                {mnCodeData && mnCodeData.slice(4, 5).map((mn) => (
                                    <option key={mn.ID} value={`${mn.ID}|${mn.ACC}`}>{mn.MN_CODE} [ {mn.MEAN_TH} ]</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder={`QTY [ จำนวน ] (Max: ${data ? data[0].STOCK : ''})`}
                                value={quantity}
                                onChange={(e) => {
                                    let value = e.target.value
                                    if (value < 1) value = 1
                                    if (value > data[0].STOCK) value = data[0].STOCK
                                    setQuantity(value)
                                }}
                                className='input input-bordered w-full mt-3'
                            />

                            <input type="text" placeholder="หมายเหตุ หรือ ระบุไลน์การผลิตที่จะนำไปใช้งาน" value={remark} onChange={(e) => setRemark(e.target.value)} className="input input-bordered w-full mt-3" />

                        </>
                    ) : (
                        <>
                            <Result status="success" title="เบิกพาร์ทสำเร็จ!" />
                        </>
                    )}

                    <div className='modal-action'>
                        <form method='dialog'>
                            <button className='btn' onClick={RefreshPdSubmit} >Close</button>
                        </form>

                        {!SubmitLoading ? (
                            <>
                                {!formSubmitted && IndirectData && (
                                    <>
                                        <button className='btn btn-primary ml-3' onClick={handleIdrSubmit}>เบิกพาร์ท</button>
                                    </>
                                )}
                            </>
                        ) : (
                            <button className="ml-3 text-gray-500 text-xl font-bold">
                                <span className="loading loading-spinner"></span> LOADING...
                            </button>
                        )}

                    </div>

                    {errorMessage &&
                        <Alert className='mt-2' message={errorMessage} type="error" showIcon>
                        </Alert>
                    }

                    {/* ------------------------------------------------------------------------------------------ */}
                </Tabs.TabPane>
            </Tabs>


        </>
    )
}