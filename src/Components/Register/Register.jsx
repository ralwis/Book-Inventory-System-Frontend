import './RegisterStyles.css';
import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function Register(){
    const [userRegValues, setUserRegValues] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleInputChange = (event) => {
        event.preventDefault();

        const { name, value } = event.target;
        setUserRegValues((userRegValues) => ({
            ...userRegValues,
            [name]: value
        }));
    };

    const [submitted, setSubmitted] = useState(false);
    const [valid, setValid] = useState(false);

    const apiBaseUrl = 'http://localhost:5029/api/User/register';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userRegValues.name && userRegValues.email && userRegValues.password) {

            try {
                const response = await axios.post(apiBaseUrl, userRegValues);

                if (response.status === 201) {
                    setValid(true);
                }
            } catch (error) {
                console.error(error);
                alert("Registration failed. Please try again.");
            }
        }
        setSubmitted(true);
    };

    return(
        <div>
            <div className='navbar'>
                <h2>Books Inventory System</h2>
                <button><Link to={'login'}>Login</Link></button>
            </div>

            <div className="form-container">
                <form className="register-form" onSubmit={handleSubmit}>
                    {submitted && valid && (
                    <div className="success-message">
                        <h3>
                        {" "}
                        Welcome {userRegValues.name}
                        </h3>
                        <div> Your registration was successful! </div>
                    </div>
                    )}
                    {!valid && (
                    <input
                        className="form-field"
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={userRegValues.name}
                        onChange={handleInputChange}
                    />
                    )}

                    {submitted && !userRegValues.name && (
                    <span id="first-name-error">Please enter name</span>
                    )}

                    {!valid && (
                    <input
                        className="form-field"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={userRegValues.email}
                        onChange={handleInputChange}
                    />
                    )}

                    {submitted && !userRegValues.email && (
                    <span id="last-name-error">Please enter email</span>
                    )}

                    {!valid && (
                    <input
                        className="form-field"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={userRegValues.password}
                        onChange={handleInputChange}
                    />
                    )}

                    {submitted && !userRegValues.email && (
                    <span id="email-error">Please enter password</span>
                    )}
                    {!valid && (
                    <button className="form-submit-field" type="submit">
                        Register
                    </button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Register;