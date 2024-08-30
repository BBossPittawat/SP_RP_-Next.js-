'use client'
import Image from "next/image"

export default function admin() {

    return (
        <>

            <div className='px-3'>

                <div className="flex justify-between items-center my-3 rounded-xl bg-yellow-300 h-14">

                    <div className="flex items-center">
                        <Image src="/Image/Admin_icon.svg" alt="icon" width={40} height={40} className="mx-3" />
                        <span className="text-xl font-bold text-gray-500">ADMIN MODE</span>
                    </div>

                    <div className="flex mx-3 space-x-3">
                        <button className="btn btn-sm bg-blue-400 text-white text-xg font-bold">
                            REGISTRATION
                            <Image src="/Image/registration.svg" alt="icon" width={20} height={20} className="ml-1" />
                        </button>

                        <button className="btn btn-sm bg-red-400 text-white text-xg font-bold">
                            DRAWN-OUT STOCK
                            <Image src="/Image/arrow.svg" alt="icon" width={20} height={20} className="" />
                        </button>
                    </div>

                </div>

            </div>

        </>
    )
}