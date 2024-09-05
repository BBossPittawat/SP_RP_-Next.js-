'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Checkbox, Alert, Select, Spin } from 'antd'
import useStore from '@/lib/store'

export default function Sidebar({ onSearch, onDepartmentChange }) {

    const [checkedList, setCheckedList] = useState([])
    const [checkAll, setCheckAll] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [selectedMachine, setSelectedMachine] = useState('')

    const {
        data_1: groupsData,
        // loading_1: loadingGroups,
        error_1: errorGroups,
        fetchData_1: fetchGroups,
        data_2: departments,
        fetchData_2: fetchDepartments,
        loading_2: loadingDepartments,
        data_3: productsData,
        loading_3: loadingProducts,
        fetchData_3: fetchProducts,
        data_4: jwtData,
        fetchData_4: fetchJWT,
        data_5: machinesData,
        loading_5: loadingMachines,
        error_5: errorMachines,
        fetchData_5: fetchMachines
    } = useStore()

    useEffect(() => {
        fetchJWT()
    }, [fetchJWT])

    const handleFetch = useCallback((department) => {
        fetchDepartments()
        fetchProducts(department)
        fetchGroups()
        fetchMachines(department, '')
        onDepartmentChange(department)
    }, [fetchDepartments, fetchProducts, fetchGroups, fetchMachines, onDepartmentChange])

    useEffect(() => {
        if (jwtData?.payload?.department) {
            setSelectedDepartment(jwtData.payload.department)
            handleFetch(jwtData.payload.department)
        }
    }, [jwtData, handleFetch])

    useEffect(() => {
        if (groupsData?.length > 0) {
            const allGroupIds = groupsData.map(item => item.id)
            setCheckedList(allGroupIds)
            setCheckAll(true)
        }
    }, [groupsData])
    //-------------------------------------------------------------------------------------------------  Change trigger

    const handleDepartmentChange = (department) => {
        setSelectedDepartment(department)
        setSelectedProduct('')
        setSelectedMachine('')
        handleFetch(department)
    }

    const onProductChange = (product) => {
        setSelectedProduct(product)
        setSelectedMachine('')
        fetchMachines(selectedDepartment, product)
    }

    const onMachineChange = (machine) => {
        setSelectedMachine(machine)
    }

    const onChange = (list) => {
        setCheckedList(list)
        setCheckAll(list.length === groupsData.length)
    }

    const onCheckAllChange = (e) => {
        const checkedList = e.target.checked ? groupsData.map(item => item.id) : []
        setCheckedList(checkedList)
        setCheckAll(e.target.checked)
    }

    const handleSearchClick = () => {
        // console.log("department:", selectedDepartment)
        // console.log("product:", selectedProduct)
        // console.log("machine:", selectedMachine)
        // console.log("group:", checkedList)
        onSearch({
            department: selectedDepartment,
            product: selectedProduct,
            machine: selectedMachine,
            group: checkedList
        })
        // console.log(onSearch)
    }

    if (errorGroups) return <Alert message="Error" description={errorGroups} type="error" showIcon />

    return (
        <div className="drawer drawer-open basis-40">
            <input id="sidebar" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side bg-blue-100">
                <label htmlFor="sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-48">

                    {/* Department Select */}
                    <span className='text-xs font-bold text-gray-900 mt-4'>DEPARTMENT</span>
                    {loadingDepartments ? (
                        <>
                            <Spin size="large" />
                        </>
                    ) : (
                        <>
                            <Select
                                showSearch
                                placeholder="Select a department"
                                value={selectedDepartment}
                                onChange={handleDepartmentChange}
                                options={departments?.map(dep => ({ value: dep, label: dep }))}
                                className="text-center mt-2"
                                style={{ width: '150px' }}
                            />
                        </>
                    )}

                    {/* Product Section */}
                    <span className='text-xs font-bold text-gray-900 mt-4'>PRODUCT</span>
                    {loadingProducts ? (
                        <>
                            <Spin size="large" />
                        </>
                    ) : (
                        <>
                            <Select
                                showSearch
                                placeholder="Select a product"
                                value={selectedProduct}
                                onChange={onProductChange}
                                options={productsData?.map(prod => ({ value: prod.id, label: prod.product }))}
                                className="text-center mt-2"
                                style={{ width: '150px' }}
                            />
                        </>
                    )}

                    {/* Machine Section */}
                    <span className='text-xs font-bold text-gray-900 mt-4'>PROCESS</span>
                    {loadingMachines ? (
                        <>
                            <Spin size="large" />
                        </>
                    ) : (
                        <>
                            <Select
                                showSearch
                                placeholder="Select a machine"
                                value={selectedMachine}
                                onChange={onMachineChange}
                                options={
                                    errorMachines || !machinesData || machinesData.length === 0
                                        ? [{ value: 'no_data', label: 'No Data' }]
                                        : [{ value: 'ALL', label: 'ALL' }, ...machinesData.map(machine => ({ value: machine.id, label: machine.machine }))]
                                }
                                className="text-center mt-2"
                                style={{ width: '150px' }}
                            />
                        </>
                    )}

                    {/* Group Section */}
                    <div className='mt-4'>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className='font-bold text-gray-900'>หมวดหมู่</span>
                            <Checkbox
                                onChange={onCheckAllChange}
                                checked={checkAll}
                                style={{ marginLeft: '8px' }}
                            />
                        </div>

                        <Checkbox.Group
                            value={checkedList}
                            onChange={onChange}
                            className='mt-1'
                        >
                            {groupsData?.map(item => (
                                <div key={item.id}>
                                    <Checkbox value={item.id} className='mt-1'>
                                        {item.thai_name}<br />{item.eng_name}
                                    </Checkbox>
                                </div>
                            ))}
                        </Checkbox.Group>
                    </div>

                    <button
                        className="btn btn-sm btn-primary mt-3"
                        onClick={handleSearchClick}>
                        SEARCH
                    </button>

                    {/* <button className="btn btn-primary">
                        <span className="loading loading-spinner"></span>
                        loading
                    </button> */}

                </ul>
            </div>
        </div>
    )
}