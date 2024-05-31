import Image from "next/image"
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Navbar() {

    // ---------------------------------------------------------------------------------------- logout request
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/v1/items/logout', {}, {
                headers: {
                    'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });

            router.push('/sp-rp');

        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };
    // ----------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------- Get JWTdecode
    const [decodedData, setDecodedData] = useState('');

    const fetchDecodeData = async () => {
        try {
            const response = await axios.get('/api/v1/items/decode', {
                headers: {
                    'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });

            const jsonData = response.data;
            setDecodedData(jsonData);

        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Failed to connect to the server.';
            console.error(errorMessage);
        }
    }

    useEffect(() => {
        fetchDecodeData();
    }, []);

    // ----------------------------------------------------------------------------------------


    return (
        <nav>
            <div className="navbar py-1 bg-blue-400 text-black flex justify-between items-center pr-5">

                <div className="flex items-center">
                    <Image src="/Image/sr-rp-icon.svg" alt="icon" width={40} height={40} className="mx-3" />
                    <a className="btn btn-ghost text-3xl font-bold text-white">SP-RP</a>
                </div>

                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: 900,
                        borderRadius: '15px',
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search spare part"
                        inputProps={{ 'aria-label': 'search spare part' }}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                        <DirectionsIcon />
                    </IconButton>
                </Paper>

                <div className="flex items-center">
                    <ul className="menu menu-horizontal">
                        <li>
                            <details>
                                <summary>
                                    <div className="md:block hidden">
                                        <div className="text-xg text-center font-bold text-white">
                                            {decodedData ? decodedData.payload.name : ''}
                                        </div>
                                        <div className="text-xs text-center font-bold text-white">
                                            (
                                            <span style={{ margin: '0 4px' }}>{decodedData ? decodedData.payload.status : ''}</span>
                                            )
                                        </div>
                                    </div>
                                </summary>
                                <ul className="p-5 rounded-t-none">
                                    <li><a onClick={handleLogout}>Log out</a></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>

                {/* <div className="flex items-center">
          <div className="md:block hidden">
            <div className="text-xg text-center font-bold text-white">PITTAWAT</div>
            <div className="text-xs text-center font-bold text-white">( ADMIN )</div>
          </div>
        </div> */}



            </div>
        </nav>
    )
}
