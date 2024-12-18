import axios from 'axios';

export const validateLogin = async (username, password, department) => {
    try {
        const response = await axios.post('/api/v1/log_in/validate', 
            { username, password, department }, 
            { headers: {
                'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
            }, }
        )
        return response.data
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}