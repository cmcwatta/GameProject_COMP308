import React, { useState } from 'react';
import axios from 'axios';

const AuthComponents = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Resident'); // NEW default role
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const mutation = isSignUp
            ? `
                mutation {
                    signup(
                        username: "${username}",
                        email: "${email}",
                        password: "${password}",
                        role: "${role}"
                    ) {
                        token
                        user {
                            username
                            email
                            role
                        }
                    }
                }
            `
            : `
                mutation {
                    signin(email: "${email}", password: "${password}") {
                        token
                        user {
                            username
                            email
                            role
                        }
                    }
                }
            `;

        try {
            const response = await axios.post(
                'http://localhost:4001/graphql',
                { query: mutation },
                { withCredentials: true }
            );

            const data = response.data;

            if (data.errors) {
                setMessage(data.errors[0].message);
            } else {
                if (isSignUp) {
                    setMessage('Sign up successful!');
                } else {
                    setMessage('Sign in successful!');
                    window.location.href = 'http://localhost:5174/';
                }
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

            <form onSubmit={handleSubmit}>
                {isSignUp && (
                    <>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* ROLE DROPDOWN */}
                        <div>
                            <label>Role:</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="Resident">Resident</option>
                                <option value="Municipal Staff">Municipal Staff</option>
                                <option value="Community Advocate">Community Advocate</option>
                            </select>
                        </div>
                    </>
                )}

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
            </form>

            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AuthComponents;