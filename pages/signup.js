import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import apiFetch from '../utils/api';

const slideInUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [branch, setBranch] = useState('');
    const [branches, setBranches] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await apiFetch('/api/branches/');
                if (response.ok) {
                    setBranches(await response.json());
                } else {
                    console.error('Failed to fetch branches');
                }
            } catch (error) {
                console.error('An error occurred while fetching branches:', error);
            }
        };
        fetchBranches();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!branch) {
            setError('Please select a branch.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter.');
            return;
        }
        if (!/[a-z]/.test(password)) {
            setError('Password must contain at least one lowercase letter.');
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError('Password must contain at least one special character.');
            return;
        }
        try {
            const response = await apiFetch('/api/signup/', {
                method: 'POST',
                body: JSON.stringify({ username: name, email, password, branch: parseInt(branch) }),
            });

            const data = await response.json();
            if (response.ok) {
                router.push(`/verify-otp?email=${email}`);
            } else {
                setError(Object.values(data).flat().join(' ') || 'Signup failed.');
            }
        } catch (error) {
            if (error.message !== 'Session expired') {
                setError('An error occurred.');
            }
        }
    };

    return (
        <>
            <Head><title>Sign Up - Produit Academy</title></Head>
            <Header />
            <main className="main-content auth-page">
                <div className="auth-container">
                    <h1 className="auth-title">Create Your Account</h1>
                    {error && <p className="auth-error">{error}</p>}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" placeholder="Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <select required value={branch} onChange={(e) => setBranch(e.target.value)}>
                            <option value="" disabled>Select Your Desired Branch</option>
                            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        <div style={{
                            fontSize: '0.85rem',
                            color: '#555',
                            marginTop: '10px',
                            marginBottom: '20px',
                            textAlign: 'left',
                            background: '#f9f9f9',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '1px solid #eee'
                        }}>
                            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#333' }}>Password Requirements:</p>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', color: password.length >= 8 ? '#28a745' : '#666' }}>
                                    <span style={{ marginRight: '8px' }}>{password.length >= 8 ? '✓' : '○'}</span> At least 8 characters
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', color: /[A-Z]/.test(password) ? '#28a745' : '#666' }}>
                                    <span style={{ marginRight: '8px' }}>{/[A-Z]/.test(password) ? '✓' : '○'}</span> At least one uppercase letter (A-Z)
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', color: /[a-z]/.test(password) ? '#28a745' : '#666' }}>
                                    <span style={{ marginRight: '8px' }}>{/[a-z]/.test(password) ? '✓' : '○'}</span> At least one lowercase letter (a-z)
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '#28a745' : '#666' }}>
                                    <span style={{ marginRight: '8px' }}>{/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}</span> At least one special character (!@#...)
                                </li>
                            </ul>
                        </div>

                        <button type="submit" className="cta-btn primary">Sign Up</button>
                    </form>
                    <p className="auth-switch">Already have an account? <Link href="/login">Login</Link></p>
                </div>
            </main>
            <Footer />
        </>
    );
}