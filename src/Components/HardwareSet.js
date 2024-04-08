import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logout from './Logout';
import axios from 'axios';

function HardwareSet() {
    const location = useLocation();
    const projectName = location.state?.projectName || 'ProjectName';
    const userID = location.state?.userID || ''; 
    const [hwSet1, setHwSet1] = useState({ name: 'HWSet1', capacity: 0, availability: 0 });
    const [hwSet2, setHwSet2] = useState({ name: 'HWSet2', capacity: 0, availability: 0 });
    const [quantitySet1, setQuantitySet1] = useState('');
    const [quantitySet2, setQuantitySet2] = useState('');

    useEffect(() => {
        renderHardwareSets();
    }, []);

    const renderHardwareSets = async () => {
        try {
            const hwSetNames = ['HWSet1', 'HWSet2'];
            const hwSetData = await Promise.all(hwSetNames.map(async (hwSetName) => {
                try {
                    const response = await axios.post(`http://localhost:5000/fetch_set_data`, { hwSetName });
                    return response.data.hwSet;
                } catch (error) {
                    console.error("Error rendering hardware sets:", error);
                    throw new Error('Failed to fetch hardware sets');
                }
            }));
            setHwSet1(hwSetData[0]);
            setHwSet2(hwSetData[1]);
        } catch (error) {
            console.error("Error rendering hardware sets:", error.message);
        }
    };

    const handleCheckIn = async (hwSet, userInput) => {
        const quantity = parseInt(userInput);
        if (isNaN(quantity)) {
            alert('Enter a valid number');
        } else if (quantity <= 0) {
            alert('Please enter a positive quantity');
        } else {
            try {
                const response = await axios.post('http://localhost:5000/checkin', { hwSetName: hwSet.name, quantity });
                const data = response.data;
                if (data.code === 200) {
                    if (hwSet.name === hwSet1.name) {
                        setHwSet1(prev => ({ ...prev, availability: prev.availability + quantity }));
                    } else if (hwSet.name === hwSet2.name) {
                        setHwSet2(prev => ({ ...prev, availability: prev.availability + quantity }));
                    }
                    alert(data.message); 
                } else {
                    alert(data.message); // Handle unsuccessful check-in
                }
            } catch (error) {
                alert("Unable to check in requested units due to capacity limit exceeded.");
                console.error("Error checking in units:", error);
            }
        }
    };
    
    const handleCheckOut = async (hwSet, userInput) => {
        const quantity = parseInt(userInput);
        if (isNaN(quantity)) {
            alert('Enter a valid number');
        } else if (quantity <= 0) {
            alert('Please enter a positive quantity');
        } else {
            try {
                const response = await axios.post('http://localhost:5000/checkout', { hwSetName: hwSet.name, quantity });
                const data = response.data;
                if (data.code === 200) {
                    if (hwSet.name === hwSet1.name) {
                        setHwSet1(prev => ({ ...prev, availability: prev.availability - quantity }));
                    } else if (hwSet.name === hwSet2.name) {
                        setHwSet2(prev => ({ ...prev, availability: prev.availability - quantity }));
                    }
                    alert(data.message); 
                } else {
                    alert(data.message); // Handle unsuccessful check-out
                }
            } catch (error) {
                alert("Unable to check out requested units due to insufficient available units.");
                console.error("Error checking out units:", error);
            }
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
            <Logout /> 
            <br /><br />
            <Back/>
            <h1>{projectName}</h1>
            <br />
            <div>
                <h2>{hwSet1.name}</h2>
                <div>Capacity: {hwSet1.capacity}</div>
                <div>Availability: {hwSet1.availability}</div>
                <input type="number" value={quantitySet1} onChange={(e) => setQuantitySet1(e.target.value)} placeholder="quantity" />
                <button onClick={() => handleCheckIn(hwSet1, quantitySet1)}>Check In</button>
                <button onClick={() => handleCheckOut(hwSet1, quantitySet1)}>Check Out</button>
            </div>
            <br /><br />
            <div>
                <h2>{hwSet2.name}</h2>
                <div>Capacity: {hwSet2.capacity}</div>
                <div>Availability: {hwSet2.availability}</div>
                <input type="number" value={quantitySet2} onChange={(e) => setQuantitySet2(e.target.value)} placeholder="quantity"/>
                <button onClick={() => handleCheckIn(hwSet2, quantitySet2)}>Check In</button>
                <button onClick={() => handleCheckOut(hwSet2, quantitySet2)}>Check Out</button>
            </div>
        </div>
    );
}

export default HardwareSet;
