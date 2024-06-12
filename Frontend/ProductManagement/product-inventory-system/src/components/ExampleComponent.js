

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ExampleComponent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axiosInstance.get('/example-endpoint')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div>
            {/* Display data fetched from the backend */}
        </div>
    );
};

export default ExampleComponent;
