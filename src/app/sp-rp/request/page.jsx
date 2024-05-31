'use client';
import { useEffect, useState } from 'react';
import Image from "next/image"
import Navbar from "@/../../src/components/Navbar"


export default function Page() {

  const rows = [

    {
      partNo: 'RASPBERRY-PI-4B-4G',
      spec: 'Raspberry Pi 4 Model B 4GB',
      priceTHB: 1564,
      unit: 'PC',
      product: 'SA',
      machine: 'SWAPPING',
      location: 'A172',
      stock: 20
    },

  ];

  return (

    <>
      <Navbar />

      <div className="card lg:card-side bg-base-100 shadow-xl m-10">
        <figure>
          <Image src="/Image/K113.JPG" alt="icon" width={500} height={500} />
        </figure>
        <div className="card-body">
          <table className="table text-base">
            <tbody>

              <tr className="bg-yellow-400 border-y-4 border-gray-500">
                <th>Part no.</th>
                <td>RASPBERRY-PI-4B-4G</td>
              </tr>

              <tr>
                <th>Spec</th>
                <td>Raspberry Pi 4 Model B 4GB</td>
              </tr>

              <tr className="bg-yellow-400">
                <th>Price</th>
                <td>1,564</td>
              </tr>

              <tr>
                <th>Unit</th>
                <td>PC</td>
              </tr>

              <tr className="bg-yellow-400">
                <th>Product</th>
                <td>SA</td>
              </tr>

              <tr>
                <th>Machine</th>
                <td>SWAPPING</td>
              </tr>

              <tr className="bg-yellow-400">
                <th>Location</th>
                <td>A172</td>
              </tr>

              <tr className="border-b-4 border-gray-500">
                <th>Stock</th>
                <td>30</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center pb-10">
        <div className="card lg:card-side w-1/2 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-2">REQUEST [ ร้องขอ ]</h2>
            {/* <h2 className="card-title mb-2">[ M/N format ]</h2> */}

            <select className="select select-bordered w-full">
              <option disabled selected>Product ที่จะนำไปใช้ ?</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>

            <select className="select select-bordered w-full">
              <option disabled selected>Machine [ นำไปใช้กับเครื่องจักรไหน ? ]</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>

            <select className="select select-bordered w-full">
              <option disabled selected>M/N Code ?</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>

            <select className="select select-bordered w-full">
              <option disabled selected>CCC ?</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>

            <input type="text"
              placeholder="ACC no."
              className="input input-bordered" disabled
            />

            <input type="text"
              placeholder="Budget no."
              className="input input-bordered" disabled
            />

            <input type="number"
              placeholder="Amount [ จำนวนที่ต้องการเบิก ]"
              className="input input-bordered input-warning " />

            <input type="text"
              placeholder="Remark [ หมายเหตุ ]"
              className="input input-bordered input-warning " />

            <div className="card-actions justify-end mt-2">
              <button className="btn btn-primary">SUBMIT [ส่ง]</button>
            </div>
          </div>
        </div>
      </div>

    </>

  )

}