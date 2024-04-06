import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logout from './Logout';
import axios from 'axios';
// import Back from './Back';

function HardwareSet() {
    const location = useLocation();
    const projectName = location.state?.projectName || 'ProjectName';
    const [hwSet1, setHwSet1] = useState({ name: 'HWSet1', capacity: 100, availability: 100 });
    const [hwSet2, setHwSet2] = useState({ name: 'HWSet2', capacity: 100, availability: 100 });
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
        console.log('UPDATING HARDWARE SETS');
        const endpoint = `http://localhost:5000/${activity}`;
        try {
            const response = await axios.post(endpoint, { hwSetName, quantity });
            const data = response.data;
            if (data.code === 200) {
                // Update local state to reflect the new availability
                if (hwSetName === 'HWSet1') {
                    setHwSet1(prev => ({ ...prev, availability: activity === 'checkin' ? Math.min(prev.capacity, prev.availability + quantity) : Math.max(0, prev.availability - quantity) }));
                } else if (hwSetName === 'HWSet2') {
                    setHwSet2(prev => ({ ...prev, availability: activity === 'checkin' ? Math.min(prev.capacity, prev.availability + quantity) : Math.max(0, prev.availability - quantity) }));
                }
                alert(data.message); // Display success message
            } else {
                alert(data.error); // Display error message
            }
        } catch (error) {
            console.error("Error updating hardware set:", error);
        }
    };

    const handleCheckIn = (hwSet, request) => {
        const requestNumber = parseInt(request, 10);
        if (!isNaN(requestNumber) && requestNumber > 0) {
            updateHardwareSet(hwSet.name, requestNumber, 'checkin');
        } else {
            alert('Please enter a valid positive number');
        }
    };

    const handleCheckOut = (hwSet, request) => {
        const requestNumber = parseInt(request, 10);
        if (!isNaN(requestNumber) && requestNumber > 0) {
            console.log('Checking out', requestNumber, 'from', hwSet.name);
            updateHardwareSet(hwSet.name, requestNumber, 'checkout');
        } else {
            alert('Please enter a valid positive number');
        }
    };

    return (
        <div>
            <Logout/> 
            <h1>{projectName}</h1>
            <div>
                {/* HWSet1 Section */}
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
                {/* HWSet2 Section */}
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



