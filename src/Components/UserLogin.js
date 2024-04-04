import React from 'react';


const UserLogin = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const acc = e.target.elements.userID.value;
        const password = e.target.elements.password.value;

        // Send the acc and password to the server
        fetch('http://localhost:5000/check_credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ acc, password })
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                if (data.authenticated) {
                    // User is authenticated, perform necessary actions
                    // Pop out a notification saying "Yes"
                    // existing username password combinations.
                    // Temp123 asamant
                    // Life15$ skharel.
                    alert("Yes");
                } else {
                   alert("No");
                }
            })
            .catch(error => {
                // Handle any errors that occurred during the request
            });
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" name="username" placeholder='Username' required />
                </div>

                <div className="input-box">
                    <input type="text" name="userID" placeholder='UserID' required />
                </div>

                <div className="input-box">
                    <input type="password" name="password" placeholder='Password' required />
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default UserLogin;