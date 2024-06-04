
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ddlDepartment } from '../../../actions/ddlDepartment'

export default function sidebar() {

    // ---------------------------------------------------------------------------------------- DDL Department request
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        ddlDepartment().then(setDepartments).catch(console.error);
    }, []);
    // ---------------------------------------------------------------------------------------- Product request





    // const [ddlDepartments, setDdlDepartments] = useState('');

    // const ddlDepartmentData = async () => {
    //     try {
    //         const response = await axios.get('/api/v1/log_in/ddlDepartment', {
    //             headers: {
    //                 'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
    //             },
    //         });
    //         const jsonData = await response.data
    //         setDdlDepartments(jsonData.data.departments);

    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    // -------------------------------------------- --------------------------------------------

    // useEffect(() => {
    //     ddlDepartmentData();
    // }, []);

    return (
        <>
            <div className="drawer drawer-open basis-40 ">
                <input id="sidebar" type="checkbox" className="drawer-toggle" />
                <div className="drawer-side bg-blue-100">
                    <label htmlFor="sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-48">

                        <select
                            className="select select-sm bg-blue-400 text-center font-bold text-white"
                            value={departments} onChange={(e) => setDepartments(e.target.value)}
                        >
                            {
                                departments && departments.map((dep) => (
                                    <option key={dep} value={dep}>{dep}</option>
                                ))
                            }
                        </select>

                        {/* <select
                            className="select select-sm bg-blue-400 text-center font-bold text-white"
                            value={department} onChange={(e) => setDepartment(e.target.value)}
                        >
                            {
                                ddlDepartments && ddlDepartments.map((dep) => (
                                    <option key={dep} value={dep}>{dep}</option>
                                ))
                            }
                        </select> */}

                        <span className="text-xs font-bold text-gray-500 mt-3">PRODUCT</span>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">CILANT</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">GB</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">SA</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">SA-10</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">SA-X27</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">SA3D11CT</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">SA3M08</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">STA</span>
                        </label>

                        <span className="text-xs font-bold text-gray-500 mt-3">GROUP [ หมวดหมู่ ]</span>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning mt-1 mr-2" />
                            <div className="flex flex-col items-start ml-2">
                                <span className="label-text">Machanical</span>
                                <span className="label-text text-gray-500 text-xs">[อะไหล่ทางกล]</span>
                            </div>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning mt-1 mr-2" />
                            <div className="flex flex-col items-start ml-2">
                                <span className="label-text">Electrical</span>
                                <span className="label-text text-gray-500 text-xs">[อะไหล่ทางไฟฟ้า]</span>
                            </div>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning mt-1 mr-2" />
                            <div className="flex flex-col items-start ml-2">
                                <span className="label-text">Pneumatic</span>
                                <span className="label-text text-gray-500 text-xs">[อะไหล่ระบบลม]</span>
                            </div>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning mt-1 mr-2" />
                            <div className="flex flex-col items-start ml-2">
                                <span className="label-text">Hydrolic</span>
                                <span className="label-text text-gray-500 text-xs">[อะไหล่ระบบไฮดรอลิค]</span>
                            </div>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning mt-1 mr-2" />
                            <div className="flex flex-col items-start ml-2">
                                <span className="label-text">Chemical</span>
                                <span className="label-text text-gray-500 text-xs">[สารเคมี]</span>
                            </div>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning mt-1 mr-2" />
                            <div className="flex flex-col items-start ml-2">
                                <span className="label-text">Making parts</span>
                                <span className="label-text text-gray-500 text-xs">[งานสั่งทำ]</span>
                            </div>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning mt-1 mr-2" />
                            <div className="flex flex-col items-start ml-2">
                                <span className="label-text">Other</span>
                                <span className="label-text text-gray-500 text-xs">[อื่นๆ]</span>
                            </div>
                        </label>

                        <span className="text-xs font-bold text-gray-500 mt-3">MACHINE [ เครื่องจักร ]</span>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">CORE ASSEMBLY</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">CORE SEPARATING</span>
                        </label>

                        <label className="flex items-center mt-2">
                            <input type="checkbox" name="product" className="checkbox checkbox-sm checkbox-warning" />
                            <span className="label-text mx-2">WINDING</span>
                        </label>

                    </ul>

                </div>
            </div >
        </>
    )

}