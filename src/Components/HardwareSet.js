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
    const [requestSet1, setRequestSet1] = useState('');
    const [requestSet2, setRequestSet2] = useState('');

    useEffect(() => {
        fetchHardwareSets();
    }, []);

    const fetchHardwareSets = async () => {
        const fetchHardwareSetData = async (hwSetName) => {
            try {
                const response = await axios.post(`http://localhost:5000/fetch_set_data`, { hwSetName });
                return response.data.hwSet;
            } catch (error) {
                console.error("Error fetching hardware sets:", error);
                throw new Error('Failed to fetch');
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

    const updateHardwareSet = async (hwSetName, quantity, activity) => {
        const endpoint = `http://localhost:5000/${activity}`;
        try {
            const response = await axios.post(endpoint, { hwSetName, quantity });
            const data = response.data;
            if (data.code === 200) {
                if (hwSetName === 'HWSet1') {
                    setHwSet1(prev => ({ ...prev, availability: activity === 'checkin' ? prev.availability + quantity : prev.availability - quantity }));
                } else if (hwSetName === 'HWSet2') {
                    setHwSet2(prev => ({ ...prev, availability: activity === 'checkin' ? prev.availability + quantity : prev.availability - quantity }));
                }
                alert(data.message); 
            } 
        } catch (error) {
            if (activity === 'checkin') {
                alert("Unable to check in requested units due to capacity limit exceeded."); 
            } else {
                alert("Unable to check out requested units due to insufficient available units."); 
            }
        }
    };

    const handleCheckIn = (hwSet, request) => {
        const requestNumber = parseInt(request, 10);
        if (!isNaN(requestNumber) && requestNumber > 0) {
            updateHardwareSet(hwSet.name, requestNumber, 'checkin');
        } else {
            alert('Enter a valid positive number');
        }
    };

    const handleCheckOut = (hwSet, request) => {
        const requestNumber = parseInt(request, 10);
        if (!isNaN(requestNumber) && requestNumber > 0) {
            console.log('Checking out', requestNumber, 'from', hwSet.name);
            updateHardwareSet(hwSet.name, requestNumber, 'checkout');
        } else {
            alert('Enter a valid positive number');
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
            <div>
                <h2>{hwSet1.name}</h2>
                <div>
                    <p>Capacity: {hwSet1.capacity}</p>
                    <p>Availability: {hwSet1.availability}</p>
                </div>
                <div>
                    <input
                        type="number"
                        value={requestSet1}
                        onChange={(e) => setRequestSet1(e.target.value)}
                        placeholder="request"
                    />
                    <button onClick={() => handleCheckIn(hwSet1, requestSet1)}>Check In</button>
                    <button onClick={() => handleCheckOut(hwSet1, requestSet1)}>Check Out</button>
                </div>
            </div>
            <div>
                <h2>{hwSet2.name}</h2>
                <div>
                    <p>Capacity: {hwSet2.capacity}</p>
                    <p>Availability: {hwSet2.availability}</p>
                </div>
                <div>
                    <input
                        type="number"
                        value={requestSet2}
                        onChange={(e) => setRequestSet2(e.target.value)}
                        placeholder="request"
                    />
                    <button onClick={() => handleCheckIn(hwSet2, requestSet2)}>Check In</button>
                    <button onClick={() => handleCheckOut(hwSet2, requestSet2)}>Check Out</button>
                </div>
            </div>
        </div>
    );
}

export default HardwareSet;



