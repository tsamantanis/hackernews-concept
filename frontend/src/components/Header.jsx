/* eslint-disable react/button-has-type */
import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { AUTH_TOKEN } from '../constants';

const Header = () => {
    const history = useHistory();
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
        <div className="flex pa1 justify-between nowrap header">
            <div className="flex flex-fixed black">
                <div className="fw7 mr1">Hacker News</div>
                <Link to="/" className="ml1 no-underline black">
                    New
                </Link>
                <div className="ml1">|</div>
                <Link to="/top" className="ml1 no-underline black">
                    Top
                </Link>
                <div className="ml1">|</div>
                <Link to="/search" className="ml1 no-underline black">
                    Search
                </Link>
                {authToken && (
                    <div className="flex">
                        <div className="ml1">|</div>
                        <Link to="/create" className="ml1 no-underline black">
                            Submit
                        </Link>
                    </div>
                )}
            </div>
            <div className="flex flex-fixed">
                {authToken ? (
                    <button
                        className="ml1 black button-header"
                        onClick={() => {
                            localStorage.removeItem(AUTH_TOKEN);
                            history.push('/');
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="ml1 no-underline black"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
