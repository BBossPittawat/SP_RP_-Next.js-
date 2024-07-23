'use client'
import { useEffect, useState } from 'react'
import { Checkbox, Spin, Alert } from 'antd'
import useStore from '@/lib/store'

const DataFetcherOne = () => {
  const { data_1, loading_1, error_1, fetchData_1 } = useStore()
  const [checkedList, setCheckedList] = useState([])
  const [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    fetchData_1()
  }, [fetchData_1])

  if (loading_1) return <Spin tip="Loading..."></Spin>

  if (error_1) return <Alert message="Error" description={error_1} type="error" showIcon />

  const thaiNames = data_1?.map(item => item.thai_name) || []

  const onChange = list => {
    setCheckedList(list)
    setCheckAll(list.length === thaiNames.length)
  }

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? thaiNames : [])
    setCheckAll(e.target.checked)
  }

  return (
    <div>
      <h2>Thai Names</h2>
      <Checkbox onChange={onCheckAllChange} checked={checkAll}>
        Check All
      </Checkbox>
      <Checkbox.Group value={checkedList} onChange={onChange}>
        {thaiNames.map((name, index) => (
          <div key={index}>
            <Checkbox value={name}>{name}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>
      <h2>Count of English Names: {thaiNames.length}</h2>
    </div>
   )
}

export default DataFetcherOne 