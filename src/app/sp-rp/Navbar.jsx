'use client'
import Image from "next/image"

export default function Navbar() {
    return (
        <nav>
            <div className="navbar bg-custom-gray text-black">

                <Image src="/Image/sr-rp-icon.svg" alt="icon" width={40} height={40} className="mx-3" />

                <div className="flex-1">
                    <a className="btn btn-ghost text-3xl font-bold text-blue-500">SP-RP</a>
                </div>

                <div className="flex-none">
                    <ul className="menu menu-horizontal">

                        <div className="md:block hidden">
                            <Image src="/Image/Murata_Logo.png" alt="logo" width={85} height={85}></Image>
                        </div>

                    </ul>
                </div>
            </div>
        </nav>
    )
}