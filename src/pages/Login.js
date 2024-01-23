import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { setUserSession } from "../service/AuthService";
import '../index.css';

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const loginAPIUrl = `${apiUrl}/prod/login`;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const tabletWidthThreshold = 768; // Adjust this value as needed
            setIsMobile(window.innerWidth < tabletWidthThreshold);
        };

        // Attach event listener for window resize
        window.addEventListener('resize', handleResize);

        // Call handleResize on component mount to check initial width
        handleResize();

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const submitHandler = (event) => {
        event.preventDefault();

        if (isMobile) {
            setErrorMessage('Please turn on desktop mode');
            return;
        }

        if (username.trim() === '' || password.trim() === '') {
            setErrorMessage('Both username and password are required');
            return;
        }

        setErrorMessage(null);
        const requestConfig = {
            headers: {
                'x-api-key': apiKey
            }
        }
        const requestBody = {
            username: username,
            password: password
        };

        axios.post(loginAPIUrl, requestBody, requestConfig)
            .then((response) => {
                setUserSession(response.data.user, response.data.token);
                navigate('/todo');
            })
            .catch(error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('Sorry, the server is currently down. Please try again later.');
                }
            });
    }

    return (
        <div>
            {isMobile ? (
                <p>Please turn on desktop mode</p>
            ) : (
                <div className="login-container">
                    <form className="loginForm" onSubmit={submitHandler}>
                        <h5>Login</h5>
                        username: <input type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br />
                        password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br />
                        <input className="submitButton" type="submit" value="Login" />
                        <p>No account? <a href="/register">Sign Up</a> </p>
                        {errorMessage && <p className="message">{errorMessage}</p>}
                    </form>
                </div>
            )}
        </div>
    )
};

export default Login;
