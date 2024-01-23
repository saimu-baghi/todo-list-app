import React from 'react';
// import { getUser, resetUserSession } from '../service/AuthService';
// import { useNavigate } from 'react-router-dom';
import TodoList from './TodoList';
import '../index.css'; // Import the CSS file

const PremiumContent = () => {
    // const user = getUser();
    // const name = user !== 'undefined' && user ? user.name : '';
    // const navigate = useNavigate();

    // const logoutHandler = () => {
    //     resetUserSession();
    // navigate('/');
    // }

    return (
        <div>
            {/* <p className='heading'> Welcome {name} <br />
           <input type='button' value="Logout" onClick={logoutHandler} className='logoutButton'/> </p> */}
            < TodoList />
        </div>
    )
};

export default PremiumContent;