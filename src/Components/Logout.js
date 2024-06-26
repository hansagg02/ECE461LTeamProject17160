import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate(`/`);
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;