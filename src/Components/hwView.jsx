import React, { useState } from 'react';
import '../App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Superblock({ name }) {
  const [highlighted, setHighlighted] = useState(false);

  const handleJoinLeave = () => {
    setHighlighted(!highlighted);
  };

  return (
    <div className={`superblock ${highlighted ? 'highlighted' : ''}`}>
      <h2>{name}</h2>
      <ul className="horizontal-container"> {/* Add horizontal-container class here */}
        <p className="horizontal-item">list, of, authorized, users</p>
      </ul>
      <div className="vertical-container">
      {checkincheckout({count:50})}
      {checkincheckout({count:0})}
      </div>
      <div className="switch">
      <Button variant={highlighted?'contained':'outlined'} color={highlighted?'success':'error'} onClick={handleJoinLeave}>{highlighted ? 'Leave' : 'Join'}</Button>
      </div>
    </div>
  );
}
function checkincheckout({count}) {
  return (
    <div className="vertical-container">
      <div className="horizontal-container">
          <p className="text">Counter: {count}/100</p>
          <TextField className="horizontal-item"
            placeholder="Enter Qty"
          />
          <button className="horizontal-item">Check In</button>
          <button className="horizontal-item">Check Out</button>
      </div>
    </div>
  );

}

function App() {
  return (
    <div className="App">
      <Superblock name="Project Name 1" />
      <Superblock name="Project Name 2" />
      <Superblock name="Project Name 3" />
    </div>
  );
}

export default App;