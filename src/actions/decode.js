import axios from 'axios';

export const decode = async () => {
    try {
        const response = await axios.get('/api/v1/items/decode', {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Fetch Departments Error:', error);
        throw error;
    }
};