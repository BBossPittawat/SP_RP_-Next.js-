'use client'
import { useEffect } from 'react'
import { Select, Skeleton, Alert } from 'antd'
import useStore from '@/lib/store'

const { Option } = Select

const DepartmentDropdown = () => {
  const { data_2, loading_2, error_2, fetchData_2 } = useStore()

  useEffect(() => {
    fetchData_2()
  }, [fetchData_2])

  if (loading_2) return <Skeleton active />

  if (error_2) return <Alert message="Error" description={error_2} type="error" showIcon />

  return (
    <div>
      <h2>Departments</h2>
      <Select style={{ width: '100%' }} placeholder="Select a Department">
        {data_2?.map((department, index) => (
          <Option key={index} value={department}>{department}</Option>
        ))}
      </Select>
    </div>
   )
}

export default DepartmentDropdown 