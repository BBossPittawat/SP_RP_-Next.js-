'use client'
import { useState, useEffect } from 'react'
import { Card, Image, Badge, Spin, Pagination, Alert } from 'antd'
import Navbar from '@/components/Navbar'
import Sidebar from './Sidebar'
import useStore from '@/lib/store'
import { MonitorOutlined } from '@ant-design/icons'

const { Meta } = Card

export default function Page() {

  const [searchResults, setSearchResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 21

  const { data_8, loading_8, error_8, fetchData_8 } = useStore()

  const handleSearch = async (searchParams) => {
    await fetchData_8(searchParams)
  }

  useEffect(() => {
    if (data_8) {
      setSearchResults(data_8)
    }
  }, [data_8])

  // console.log(data_8)

  const handleCardClick = (ID) => {
    if (ID) {
      window.open(`/sp-rp/request?id=${ID}`, '_blank')
    } else {
      console.error('Invalid rowId')
    }
  }

  const monitorPageClick = () => {
    window.open(`/sp-rp/monitor`, '_blank')
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const startIndex = (currentPage - 1) * pageSize
  const currentCards = searchResults.slice(startIndex, startIndex + pageSize)

  return (
    <>
      <Navbar />
      <div className='flex flex-row'>
        <Sidebar onSearch={handleSearch} />
        <div className='basis-full p-3'>

          <div className='flex items-center rounded-xl bg-gray-300 h-14 justify-between pl-3 pr-3'>
            <div className='flex items-center space-x-3'>
              <div className='text-xm font-bold text-gray-600'>source by</div>
              <button className='btn bg-white btn-sm text-xs block text-gray-500'>
                <div>often</div>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-info"
              onClick={monitorPageClick}
            >
              <MonitorOutlined />
              Monitoring
            </button>

          </div>

          {loading_8 ? (
            <div className="flex justify-center items-center h-screen">
              <Spin size="large" />
            </div>
          ) : error_8 ? (
            <div className="flex justify-center items-center h-screen">
              <Alert
                message="Oops!"
                description={error_8}
                type="error"
                showIcon
                style={{ marginBottom: '20px' }}
              />
            </div>

          ) : (
            <>
              <div className='grid grid-cols-7 pt-3 gap-x-4 gap-y-4'>
                {currentCards.map(result => (
                  <div
                    key={result.PART_NO}
                    onClick={() => handleCardClick(result.ID)}
                    className="cursor-pointer"
                  >
                    <Card
                      className="shadow-xl"
                      cover={
                        result.IMG_URL ? (
                          <Image
                            src={result.IMG_URL}
                            alt={result.PART_NO}
                            height={120}
                            preview={false}
                            className='p-1'
                          />
                        ) : (
                          <Image
                            className='p-1'
                            src="/Image/no_img.jpg"
                            height={120}
                            preview={false}
                            alt="Description of image"
                          />
                        )
                      }
                    >
                      <Meta
                        title={<p className="truncate text-base font-bold">{result.PART_NO}</p>}
                        description={<p className='truncate'>{result.SPEC}</p>}
                      />
                      <div className="card-actions justify-end mt-2">
                        <Badge
                          count={`${result.STOCK} pcs.`}
                          style={{ backgroundColor: result.STOCK === 0 ? '#FF4000' : '#4784E9' }}
                        />
                      </div>
                    </Card>
                  </div>

                ))}


              </div>

              {data_8 && (
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={searchResults.length}
                  onChange={handlePageChange}
                  style={{ marginTop: '20px', textAlign: 'center' }}
                />
              )}

            </>
          )}
        </div>
      </div>
    </>
  )
}