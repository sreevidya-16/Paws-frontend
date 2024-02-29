import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const NgoContext = createContext();

export const NgoProvider = ({ children }) => {
    const [NgoData, setNgoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const csrftoken = localStorage.getItem('csrftoken');
            if (!csrftoken) {
                setError('You are not logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://aniresfr-backend.vercel.app/info/ngo', {
                    headers: {
                        'Authorization': `Token ${csrftoken}`,
                    },
                    withCredentials: true
                });
                if (isMounted) {
                    setNgoData(response.data);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error.message);
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <NgoContext.Provider value={{ NgoData, loading, error }}>
            {children}
        </NgoContext.Provider>
    );
};
