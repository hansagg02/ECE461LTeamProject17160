import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logout from './Logout';
import axios from 'axios';

function HardwareSet() {
    const location = useLocation();
    const projectName = location.state?.projectName || 'ProjectName';
    const userID = location.state?.userID || ''; 
    const [set1, setHwSet1] = useState({ name: 'HWSet1', capacity: 0, availability: 0 });
    const [set2, setHwSet2] = useState({ name: 'HWSet2', capacity: 0, availability: 0 });
    const [quantitySet1, setQuantitySet1] = useState('');
    const [quantitySet2, setQuantitySet2] = useState('');

    useEffect(() => {
        renderHardwareSets();
    }, []);

    const renderHardwareSets = async () => {
        const fetchHardwareSetData = async (hwSetName) => {
            try {
                const response = await axios.post(`http://localhost:5000/fetch_set_data`, { hwSetName });
                return response.data.hwSet;
            } catch (error) {
                console.error("Unable to fetch hardware sets:", error);
            }
        };

        try {
            const hwSet1Data = await fetchHardwareSetData('HWSet1');
            const hwSet2Data = await fetchHardwareSetData('HWSet2');
            setHwSet1(hwSet1Data);
            setHwSet2(hwSet2Data);
        } catch (error) {
            console.error("Error fetching hardware sets:", error);
        }
    };

    const updateCheckIn = async (hwSetName, quantity) => {
        try {
            const response = await axios.post('http://localhost:5000/checkin', { hwSetName, quantity });
            const data = response.data;
            if (data.code === 200) {
                if (hwSetName === 'HWSet1') {
                    setHwSet1(prev => ({ ...prev, availability: prev.availability + quantity }));
                } else if (hwSetName === 'HWSet2') {
                    setHwSet2(prev => ({ ...prev, availability: prev.availability + quantity }));
                }
                alert(data.message); 
            } 
        } catch (error) {
            alert("Unable to check in requested units due to capacity limit exceeded."); 
        }
    }

    const handleCheckIn = (hwSetName, userInput) => {
        const quantity = parseInt(userInput);
        if (isNaN(quantity)) {
            alert('Enter a valid number');
        } else if (quantity <= 0) {
            alert('Please enter a positive quantity')
        }else {
            updateCheckIn(hwSetName, quantity)
        }
    };

    const updateCheckOut = async (hwSetName, quantity) => {
        try {
            const response = await axios.post('http://localhost:5000/checkout', { hwSetName, quantity });
            const data = response.data;
            if (data.code === 200) {
                if (hwSetName === 'HWSet1') {
                    setHwSet1(prev => ({ ...prev, availability: prev.availability - quantity }));
                } else if (hwSetName === 'HWSet2') {
                    setHwSet2(prev => ({ ...prev, availability: prev.availability - quantity }));
                }
                alert(data.message); 
            } 
        } catch (error) {
            alert("Unable to check out requested units due to insufficient available units."); 
        }
    }

    const handleCheckOut = (hwSetName, userInput) => {
        const quantity = parseInt(userInput);
        if (isNaN(quantity)) {
            alert('Enter a valid number');
        } else if (quantity <= 0) {
            alert('Please enter a positive quantity')
        } else {
            updateCheckOut(hwSetName, quantity);
        }
    };

    const Back = () => {
        const navigate = useNavigate();
        const handleBack = () => {
            navigate(`/projects`, { state: { userID: userID } });
        }; 
    
        return (
            <button onClick={handleBack}>Back to Projects</button>
        );
    };

    return (
        <div>
            <Logout/> 
            <br /><br />
            <Back/>
            <h1>{projectName}</h1>
            <br />
                <h2>{set1.name}</h2>
                <div>Capacity: {set1.capacity} </div>
                <div>Availability: {set1.availability}</div>
                <input type="number" value={quantitySet1} onChange={(e) => setQuantitySet1(e.target.value)} placeholder="quantity" />
                <button onClick={() => handleCheckIn(set1.name, quantitySet1)}>Check In</button>
                <button onClick={() => handleCheckOut(set1.name, quantitySet1)}>Check Out</button>
            <br /><br />
                <h2>{set2.name}</h2>
                <div>Capacity: {set2.capacity}</div>
                <div>Availability: {set2.availability}</div>
                <input type="number" value={quantitySet2} onChange={(e) => setQuantitySet2(e.target.value)} placeholder="quantity"/>
                <button onClick={() => handleCheckIn(set2.name, quantitySet2)}>Check In</button>
                <button onClick={() => handleCheckOut(set2.name, quantitySet2)}>Check Out</button>
        </div>
    );
}

export default HardwareSet;



