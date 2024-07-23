'use client'
import { useEffect, useState } from 'react'
import { Spin, Alert, Modal, Image } from 'antd'
import Marquee from 'react-fast-marquee';
import Navbar from '@/components/Navbar'
import Req_mn from './Req_mn'
import Req_norm from './Req_norm'
import Req_other_dept from './Req_other_dept'
import useStore from '@/lib/store'

const { confirm } = Modal

export default function Page() {

  const [id, setId] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      setId(searchParams.get('id'))
    }
  }, [])

  const { data_10, loading_10, error_10, fetchData_10 } = useStore()
  const {
    data_4,
    // loading_4,
    // error_4,
    fetchData_4
  } = useStore()

  useEffect(() => {
    if (id) fetchData_10(id)
    fetchData_4()
  }, [id, fetchData_10, fetchData_4])

  if (loading_10) return (
    <div className="flex justify-center items-center h-screen">
      <Spin size="large" />
    </div>
  )

  if (error_10) return <Alert message="Error" description={error_10} type="error" showIcon />

  const tableRows = [
    { label: "Part no.", value: data_10[0].PART_NO },
    { label: "Spec", value: data_10[0].SPEC },
    { label: "Price", value: `${data_10[0].PRICE} ${data_10[0].CURR}` },
    { label: "Unit", value: data_10[0].UNIT },
    { label: "Product", value: data_10[0].PD },
    { label: "Machine", value: data_10[0].MC_NAME },
    { label: "Location", value: data_10[0].LOCATION },
    { label: "Stock", value: data_10[0].STOCK }
  ]

  const part_section = parseInt(data_10[0]?.DEPT?.substring(2, 3))
  const log_in_section = parseInt(data_4?.payload?.section?.substring(2, 3))
  const section = parseInt(data_4?.payload?.section?.substring(3, 4))

  return (
    <>
      <Navbar />

      <div className="card lg:card-side bg-base-100 shadow-xl m-10 pl-2">

        <figure>
          <Image
            className='border border-gray-500 rounded-3xl'
            src={data_10[0].IMG_URL || "/Image/no_img.jpg"}
            alt="Part Image"
            width={650}
            height={500}
          />
        </figure>

        <div className="card-body">
          <table className="table text-base">
            <tbody>
              {tableRows.map((row, index) => {
                let rowClass = ""
                if (index === 0) rowClass = "bg-yellow-400 border-y-4 border-gray-500"
                else if (index === tableRows.length - 1) rowClass = "border-b-4 border-gray-500"
                else if (index % 2 === 0) rowClass = "bg-yellow-400"

                return (
                  <tr key={index} className={rowClass}>
                    <th>{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {data_10[0].REMARK &&
            <Alert
              banner
              message={
                <Marquee pauseOnHover gradient={false} style={{ fontSize: '18px' }}>
                  ADMIN Message :  {data_10[0].REMARK}
                </Marquee>
              }
            />
          }

          {data_10[0].STOCK !== 0 ? (
            <button className="btn btn-neutral" onClick={() =>
              document.getElementById('my_modal').showModal()}>
              เบิกพาร์ท [ Request ]
            </button>
          ) : (
            <button className="btn btn-outline btn-error"> NO STOCK [ หมดจ้า ]</button>
          )}

        </div>
      </div>

      <dialog id="my_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">REQUEST [ ร้องขอ ]</h3>
          {
            part_section === log_in_section
              ? section === 4
                ? <Req_mn data={data_10} fetchData_10={fetchData_10} />
                : <Req_norm data={data_10} fetchData_10={fetchData_10} />
              : part_section !== log_in_section
                ? <Req_other_dept data={data_10} fetchData_10={fetchData_10} />
                : null
          }
        </div>
      </dialog>

    </>
  )
}