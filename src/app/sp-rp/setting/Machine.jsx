'use client'
import useStore from '@/lib/store'
import { useState, useEffect } from 'react'
import { Table, Button, Input, Select, Spin } from 'antd'

export default function Machine({ department }) {
    const {
        data_33,
        // loading_33,
        fetchData_33,
        data_34,
        loading_34,
        fetchData_34,
        data_35,
        // loading_35,
        fetchData_35,
        // data_36,
        // loading_36,
        fetchData_36,
        // data_37,
        // loading_37,
        fetchData_37,
    } = useStore()

    const [inputValue, setInputValue] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedCCC, setSelectedCCC] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedPeriod, setSelectedPeriod] = useState('')
    const [selectedBudgetNo, setSelectedBudgetNo] = useState('')
    const [selectedProductItem, setSelectedProductItem] = useState(null)
    const [editingRow, setEditingRow] = useState(null)

    useEffect(() => {
        if (!data_33 && department) fetchData_33(department)
    }, [department, data_33, fetchData_33])

    const uniqueCCC = [...new Set(data_33?.map(item => item.CCC))]
    const filteredProducts = data_33?.filter(item => item.CCC === selectedCCC)

    const uniquePeriod = [...new Set(data_35?.map(item => item.PERIOD))]
    const filteredBudget = data_35?.filter(item => item.PERIOD === selectedPeriod)

    const SubmitClicked = async () => {

        const selectedBudgetItem = filteredBudget?.find(item => item.BUDGET_NO === selectedBudgetNo)
        if (!inputValue || !selectedBudgetItem?.ID || !selectedProductItem) {
            setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน')
            return
        }

        const isDuplicate = data_34?.some(item => item.MC_NAME.toUpperCase() === inputValue.toUpperCase());
        if (isDuplicate) {
            setErrorMessage('พบชื่อเครื่องจักรซ้ำ');
            return;
        }

        const requestData = {
            pd_id: selectedProductItem.PD_ID,
            mc_name: inputValue,
            dep_id: selectedProductItem.DEP_ID,
            budget_id: selectedBudgetItem.ID,
        }

        await fetchData_36(requestData)

        setErrorMessage('')
        setSelectedPeriod('')
        setSelectedBudgetNo('')
        setInputValue('')

        const pd_id = selectedProductItem.PD_ID
        await fetchData_34(pd_id)
    }

    const handleEdit = (record) => {

        setEditingRow(record.ID)
        setInputValue(record.MC_NAME)

        if (record.PERIOD) {
            setSelectedPeriod(record.PERIOD)
        } else {
            setSelectedPeriod('')
        }

        if (record.BUDGET_NO) {
            setSelectedBudgetNo(record.BUDGET_NO)
        } else {
            setSelectedBudgetNo('')
        }

    }

    const ReviseClicked = async () => {

        const selectedBudgetItem = filteredBudget?.find(item => item.BUDGET_NO === selectedBudgetNo)

        if (!inputValue || !selectedBudgetItem?.ID || !selectedProductItem) {
            setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน')
            return
        }

        const requestData = {
            row_id: editingRow,
            mc_name: inputValue,
            budget_id: selectedBudgetItem.ID,
        }

        await fetchData_37(requestData)

        setErrorMessage('')
        setSelectedPeriod('')
        setSelectedBudgetNo('')
        setInputValue('')
        setEditingRow(null)

        const pd_id = selectedProductItem.PD_ID
        await fetchData_34(pd_id)

    }

    const CccChanged = async (value) => {
        await fetchData_35(department, value)
        setSelectedCCC(value)
        setSelectedPeriod('')
        setSelectedBudgetNo('')
        setSelectedProduct('')
    }

    const ProductChanged = async (value) => {
        const productItem = filteredProducts.find(item => item.PD_ID === value)
        setSelectedProductItem(productItem)
        await fetchData_34(value)
    }

    const columns = [
        { title: 'MC NAME', dataIndex: 'MC_NAME', key: 'MC_NAME', align: 'center' },
        { title: 'PERIOD', dataIndex: 'PERIOD', key: 'PERIOD', align: 'center' },
        { title: 'BUDGET NO.', dataIndex: 'BUDGET_NO', key: 'BUDGET_NO', align: 'center' },
        {
            key: "action",
            align: "center",
            render: (text, record) => (
                <Button className='btn btn-sm btn-primary' onClick={() => handleEdit(record)}>EDIT</Button>
            )
        }
    ]

    return (
        <>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex items-center mt-3">
                        <h2 className="font-bold mr-2">CCC :</h2>
                        <Select
                            placeholder="Select CCC"
                            value={selectedCCC}
                            onChange={CccChanged}
                            style={{ width: '90%' }}
                        >
                            {uniqueCCC.map((ccc, index) => (
                                <Select.Option key={index} value={ccc}>
                                    {ccc}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <div className="flex items-center mt-3">
                        <h2 className="font-bold mr-2">PRODUCT :</h2>
                        <Select
                            placeholder="Select Product"
                            value={selectedProduct}
                            onChange={value => {
                                setSelectedProduct(value)
                                ProductChanged(value)
                            }}
                            style={{ width: '90%' }}
                        >
                            {filteredProducts?.map((item, index) => (
                                <Select.Option key={index} value={item.PD_ID}>
                                    {item.PRODUCT}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">REGISTRATION</h2>
                        <div className="card-actions flex flex-col">
                            {/* REGISTRATION */}
                            <h2 className="font-bold mt-3">Machine name</h2>
                            <Input
                                type="text"
                                placeholder="input machine name"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                            />

                            <h2 className="font-bold mt-3">Budget no.</h2>

                            {/* Select for Period */}
                            <Select
                                placeholder="Select period"
                                value={selectedPeriod}
                                onChange={value => {
                                    setSelectedPeriod(value)
                                    setSelectedBudgetNo('')
                                }}
                                style={{ width: '100%' }}
                            >
                                {uniquePeriod.map((period, index) => (
                                    <Select.Option key={index} value={period}>
                                        {period}
                                    </Select.Option>
                                ))}
                            </Select>

                            {/* Select for Budget No. */}
                            <Select
                                placeholder="Select Budget No."
                                value={selectedBudgetNo}
                                onChange={value => setSelectedBudgetNo(value)}
                                style={{ width: '100%' }}
                                disabled={!selectedPeriod}
                            >
                                {filteredBudget?.map((item) => (
                                    <Select.Option key={item.ID} value={item.BUDGET_NO}>
                                        {`${item.BUDGET_NO}: ${item.DESCRIPTION}`}
                                    </Select.Option>
                                ))}
                            </Select>

                        </div>

                        <div className='flex justify-end mt-2'>

                            {editingRow === null ? (
                                <Button className='btn btn-sm btn-neutral' onClick={SubmitClicked}>REGISTER</Button>
                            ) : (
                                <Button className='btn btn-sm btn-warning' onClick={ReviseClicked}>REVISE</Button>
                            )}


                        </div>


                        <div className='flex justify-end'>
                            {errorMessage && (
                                <div className="text-red-500">{errorMessage}</div>
                            )}
                        </div>


                    </div>
                </div>

                {/* Data Table */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">DATABASE</h2>
                        {loading_34 ? (
                            <Spin size="large" />
                        ) : (
                            <>
                                {!loading_34 && (
                                    <Table columns={columns} dataSource={data_34} rowKey='MC_NAME' />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}