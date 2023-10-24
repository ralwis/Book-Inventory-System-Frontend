import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

function Login(){
    const [userLoginValues, setUserLoginValues] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setUserLoginValues((userLoginValues) => ({
            ...userLoginValues,
            [name]: value
        }));
    };

    const [submitted, setSubmitted] = useState(false);
    const [valid, setValid] = useState(false);

    const apiBaseUrl = 'http://localhost:5029/api/User/login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userLoginValues.email && userLoginValues.password) {
            try {
                const response = await axios.post(apiBaseUrl, userLoginValues);

                if (response.status === 200) {
                    setValid(true);
                    localStorage.setItem("userData", JSON.stringify(response.data));
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error(error);
                alert("Login failed. Check credentials and try again.");
            }
        }
        setSubmitted(true);
    };

    return(
        <div>
            <div className='navbar'>
                <h2>Books Inventory System</h2>
                <button><Link to={'/'}>Register</Link></button>
            </div>

            <div className="form-container">
                <form className="register-form" onSubmit={handleSubmit}>
                {!valid && (
                    <input
                        className="form-field"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={userLoginValues.email}
                        onChange={handleInputChange}
                    />
                    )}

                    {submitted && !userLoginValues.email && (
                    <span id="first-name-error">Please enter email</span>
                    )}

                    {!valid && (
                    <input
                        className="form-field"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={userLoginValues.password}
                        onChange={handleInputChange}
                    />
                    )}

                    {submitted && !userLoginValues.password && (
                    <span id="last-name-error">Please enter password</span>
                    )}

                    {!valid && (
                    <button className="form-submit-field" type="submit">
                        Login
                    </button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Login;