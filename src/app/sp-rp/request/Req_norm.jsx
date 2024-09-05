'use client'
import { Tabs, Alert, Result } from 'antd'
import { useState, useEffect } from 'react'
import useStore from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function Req_norm({ data, fetchData_10 }) {

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
        // error_5: errorMachines,
        fetchData_5: fetchMachines,
        // data_15: submitsDataProduction,
        fetchData_15: submitRequestProduction,
        // error_15: errorSubmitProduction,
        data_12: IndirectData,
        fetchData_12: fetchIndirect,
        // error_12: errorIndirect,
        data_13: mnCodeData,
        fetchData_13: fetchMnCodes,
        // data_16: submitsDataIndirect,
        fetchData_16: submitRequestIndirect,
        // error_16: errorSubmitIndirect,
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
            req_type_id: 3,
            // product_id: selectedProduct,
            // machine_id: selectedMachine,
            budget_id: machinesData[0].budget_id,
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
            await submitRequestProduction(requestData)

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

        let section = jwtData.payload.section
        let ccc

        switch (section) {
            case "MT210":
                ccc = "2510"
                break

            case "MT220":
                ccc = "2520"
                break

            case "MT230":
                ccc = "2530"
                break

            case "MT240":
                ccc = "2540"
                break

            case "MT250":
                ccc = "2550"
                break

            case "MT260":
                ccc = "2560"
                break

            case "MT270":
                ccc = "2570"
                break

            case "MT2C0":
                ccc = "25C0"
                break
        }


        let requestData = {
            emp_code: jwtData.payload.emp_code,
            req_type_id: 4,
            ccc: ccc,
            mn_code_id: selectedMnCode,
            acc: selectedMnAcc,
            qty: quantity,
            remark,
            part_id
        }

        if (
            !requestData.emp_code || requestData.emp_code == "" ||
            !requestData.req_type_id || requestData.req_type_id == "" ||
            !requestData.ccc || requestData.ccc == "" ||
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
                                <option disabled selected value="">Product [ โพรดักส์ที่จะนำไปใช้งาน ]</option>
                                {productsData && productsData.map((item) => (
                                    <option key={item.id} value={`${item.id}|${item.ccc}`}>{item.product}</option>
                                ))}
                            </select>

                            <select value={selectedMnCode ? `${selectedMnCode}|${selectedMnAcc}` : ''} onChange={onMnCodeChange} className="select select-bordered w-full mt-3">
                                <option value='' disabled selected>M/N Code</option>
                                {mnCodeData && mnCodeData.map((mn) => (
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

                            <input type="text" placeholder="Remark [ หมายเหตุ ]" value={remark} onChange={(e) => setRemark(e.target.value)} className="input input-bordered w-full mt-3" />

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

                            <select value={selectedMnCode ? `${selectedMnCode}|${selectedMnAcc}` : ''} onChange={onMnCodeChange} className="select select-bordered w-full mt-3">
                                <option value='' disabled selected>M/N Code</option>
                                {mnCodeData && mnCodeData.map((mn) => (
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

                            <input type="text" placeholder="Remark [ หมายเหตุ ]" value={remark} onChange={(e) => setRemark(e.target.value)} className="input input-bordered w-full mt-3" />

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