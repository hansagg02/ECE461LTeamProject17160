import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userID, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserID, setNewUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [signupMessage, setSignupMessage] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handleUserIDChange = (e) => {
    setUserId(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  const handleNewUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };
  
  const handleNewUserIDChange = (e) => {
    setNewUserId(e.target.value);
  };
  
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };        

  const handleLogin = async (e) => {
    navigate("/projects", { state: { username: 1, id: 1, valid: true } });

  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        setSignupMessage('Passwords do not match');
        return;
    } else {
        setSignupMessage('Passwords matched');
    }
    // navigate("/projects", { state: { username: 1, id: 1, valid: true } });
    const data = { newUsername, newUserID, newPassword };
    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.code === 200) {
            setSignupMessage("Created account for user: " + data.username);
            localStorage.setItem('userId', data.id);
            navigate("/projects", { state: { username: data.username, id: data.id, valid: true } });
        } else {
            setSignupMessage("Response code: " + data.code + " Response message: " + data.error);
        }
    })
    .catch(error => {
        setSignupMessage("Failed to create account: " + error.message);
    });
        
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
        <p>{loginMessage}</p>
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
        <p>{signupMessage}</p>
      </form>
    </div>
  );
}

export default Login;
