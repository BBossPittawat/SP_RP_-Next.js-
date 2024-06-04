import axios from 'axios';

export const ddlDepartment = async () => {
    try {
        const response = await axios.get('/api/v1/log_in/ddlDepartment', {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
            },
        });
        return response.data.data.departments;
    } catch (error) {
        console.error('Fetch Departments Error:', error);
        throw error;
    }
};