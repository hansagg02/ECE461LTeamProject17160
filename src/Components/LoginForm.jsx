import React from 'react';
import './LoginForm.css';


const LoginForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const acc = e.target.elements.username.value;
        const password = e.target.elements.password.value;
        // Send the acc and password to the server
        fetch('http://localhost:3000/api/check_credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ acc, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    alert("Yes");
                } else {
                   alert("No");
                }
            }).catch(error => {});
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" name="username" placeholder='Username' required />
                </div>
                <div className="input-box">
                    <input type="password" name="password" placeholder='Password' required />
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;