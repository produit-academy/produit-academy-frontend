import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const slideInUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [branch, setBranch] = useState('');
    const [branches, setBranches] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/branches/');
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
        try {
            const response = await fetch('http://127.0.0.1:8000/api/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, email, password, branch: parseInt(branch) }),
            });
            const data = await response.json();
            if (response.ok) {
                router.push(`/verify-otp?email=${email}`);
            } else {
                setError(Object.values(data).flat().join(' ') || 'Signup failed.');
            }
        } catch (error) {
            setError('An error occurred.');
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
                        <input type="password" placeholder="Your Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <select required value={branch} onChange={(e) => setBranch(e.target.value)}>
                            <option value="" disabled>Select Your Desired Branch</option>
                            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <button type="submit" className="cta-btn">Sign Up</button>
                    </form>
                    <p className="auth-switch">Already have an account? <Link href="/login">Login</Link></p>
                </div>
            </main>
            <Footer />
        </>
    );
}