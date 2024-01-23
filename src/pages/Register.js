import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const registerUrl = `${apiUrl}/prod/register`;

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [message, setMessage] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

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
            setMessage('Please turn on desktop mode');
            return;
        }

        if (username.trim() === '' || email.trim() === '' || name.trim() === '' || password.trim() === '') {
            setMessage('All fields are required');
            return;
        }
        if (password.trim() !== rePassword.trim()) {
            setMessage('Password does not match');
            return;
        }
        setMessage(null);
        const requestConfig = {
            headers: {
                'x-api-key': apiKey
            }
        }

        const requestBody = {
            username: username,
            email: email,
            name: name,
            password: password
        }

        axios.post(registerUrl, requestBody, requestConfig)
            .then(response => {
                setMessage('Registration Successful');
                navigate('/');

            })
            .catch(error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('Sorry, the server is currently down. Please try again later.');
                }
            });

    }

    return (
        <div>
            {isMobile ? (
                <p>Please turn on desktop mode</p>
            ) : (
                <div className='register-container'>
                    <form className='registerForm' onSubmit={submitHandler}>
                        <h5>Register</h5>
                        name: <input type="text" pattern="[A-Za-z ]{3,32}"
                            title="Name should consist of alphabetic characters and spaces, between 3 and 32 characters long." value={name} onChange={event => setName(event.target.value)} /> <br />
                        email: <input type="email" value={email} onChange={event => setEmail(event.target.value)} /> <br />
                        username: <input type="text" pattern='^[A-Za-z0-9_]{3,15}$' title="Username should be 3 to 15 characters long and can contain letters, numbers, and underscores." value={username} onChange={event => setUsername(event.target.value)} /> <br />
                        password: <input type="password"
                            pattern='(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'
                            title="Password should be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number OR one special character." value={password} onChange={event => setPassword(event.target.value)} /> <br />
                        Re-password: <input type="password" value={rePassword} onChange={event => setRePassword(event.target.value)} /> <br />
                        <input className='submitButton' type="submit" value="Register" />
                        {message && <p className='message'>{message}</p>}
                        <p>Have an account? <a href='/'>Log In</a></p>
                    </form>
                </div>
            )}
        </div>
    )
};

export default Register;