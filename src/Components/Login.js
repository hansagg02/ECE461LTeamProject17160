import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserID, setNewUserID] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handleUserIDChange = (e) => {
    setUserID(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  const handleNewUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };
  
  const handleNewUserIDChange = (e) => {
    setNewUserID(e.target.value);
  };
  
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };        

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {username, userID, password });
      
      if (response.data.code === 200) {
        navigate('/projects', { state: { userID } });
      } 
    } catch (error) {
      alert("Invalid login credentials");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
   
    try {
      const response = await axios.post('http://localhost:5000/signup', {newUsername, newUserID, newPassword});
      
      if (response.data.code === 200) {
        navigate('/projects', { state: { newUserID } });
      } 

    } catch (error) {
      alert("Failed to create account: User already exists");
    }     
  };

  return (
    <div>
      <h2>Returning User? Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username" required />
        <br />
        <input type="text" value={userID} onChange={handleUserIDChange} placeholder="UserID" required />
        <br />
        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" required />
        <br />
        <button type="submit">Login</button>
      </form>

      <br /><br /><br /><br />
      <h2>New User? Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" value={newUsername} onChange={handleNewUsernameChange} placeholder="Username" required />
        <br />
        <input type="text" value={newUserID} onChange={handleNewUserIDChange} placeholder="UserID" required />
        <br />
        <input type="password" value={newPassword} onChange={handleNewPasswordChange} placeholder="Password" required />
        <br />
        <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" required />
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Login;
