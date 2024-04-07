import React from 'react';
import { useNavigate } from 'react-router-dom';

const Back = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(`/projects`);
    };

    return (
        <button onClick={handleBack}>Back</button>
    );
};

export default Back;