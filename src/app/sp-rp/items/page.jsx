'use client';
import { useEffect, useState } from 'react';
import Image from "next/image"
import Navbar from "@/../../src/components/Navbar"
import Sidebar from './Sidebar';


export default function Page() {

  const [decodedData, setDecodedData] = useState(null);

  return (

    <>
      <Navbar />

      <div className='flex flex-row'>

        <Sidebar />

        <div className="basis-full p-3">
          <div className="flex items-center rounded-xl bg-gray-300 h-14 justify-start pl-3 space-x-3">
            <div className="text-xm font-bold text-gray-600 ">source by</div>

            <button className='btn bg-white btn-sm text-xs block text-gray-500 '>
              <div>often</div>
              <div>[ใช้บ่อย]</div>
            </button>

          </div>

          <div className='grid grid-cols-5 pt-3 gap-x-4 gap-y-4'>

            <div className="card w-full bg-base-100 shadow-xl ">
              <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
              <div className="card-body">
                <p className="truncate text-base font-bold">
                  RASPBERRY-PI-4B-4G
                </p>
                <p className='truncate'>raspberry pi 4 model b 4gb </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">3 pcs.</div>
                </div>
              </div>
            </div>

            <div className="card w-full bg-base-100 shadow-xl ">
              <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
              <div className="card-body">
                <p className="truncate text-base font-bold">
                  RASPBERRY-PI-4B-4G
                </p>
                <p className='truncate'>raspberry pi 4 model b 4gb </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">3 pcs.</div>
                </div>
              </div>
            </div>


            <div className="card w-full bg-base-100 shadow-xl ">
              <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
              <div className="card-body">
                <p className="truncate text-base font-bold">
                  RASPBERRY-PI-4B-4G
                </p>
                <p className='truncate'>raspberry pi 4 model b 4gb </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">3 pcs.</div>
                </div>
              </div>
            </div>


            <div className="card w-full bg-base-100 shadow-xl ">
              <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
              <div className="card-body">
                <p className="truncate text-base font-bold">
                  RASPBERRY-PI-4B-4G
                </p>
                <p className='truncate'>raspberry pi 4 model b 4gb </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">3 pcs.</div>
                </div>
              </div>
            </div>


            <div className="card w-full bg-base-100 shadow-xl ">
              <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
              <div className="card-body">
                <p className="truncate text-base font-bold">
                  RASPBERRY-PI-4B-4G
                </p>
                <p className='truncate'>raspberry pi 4 model b 4gb </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">3 pcs.</div>
                </div>
              </div>
            </div>


            <div className="card w-full bg-base-100 shadow-xl ">
              <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
              <div className="card-body">
                <p className="truncate text-base font-bold">
                  RASPBERRY-PI-4B-4G
                </p>
                <p className='truncate'>raspberry pi 4 model b 4gb </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">3 pcs.</div>
                </div>
              </div>
            </div>



          </div>



        </div>

      </div>

    </>

  )

}