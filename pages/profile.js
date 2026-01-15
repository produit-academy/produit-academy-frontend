import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';

import styles from '../styles/Profile.module.css';
import apiFetch from '@/utils/api';

export default function Profile() {
    const [profile, setProfile] = useState({ username: '', email: '', college: '', phone_number: '' });
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiFetch('/api/profile/');
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    setError('Could not load your profile data.');
                }
            } catch (err) {
                if (err.message !== 'Session expired') {
                    setError('An error occurred while fetching your profile.');
                }
            }
        };

        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            const response = await apiFetch('/api/profile/', {
                method: 'PUT',
                body: JSON.stringify(profile),
            });
            if (response.ok) {
                setMessage('Profile updated successfully!');
            } else {
                setError('Failed to update profile.');
            }
        } catch (err) {
            if (err.message !== 'Session expired') {
                setError('An error occurred during the update.');
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            const response = await apiFetch('/api/change-password/', {
                method: 'PUT',
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
            });
            if (response.ok) {
                setMessage('Password changed successfully!');
                setOldPassword('');
                setNewPassword('');
            } else {
                setError('Failed to change password. Please check your old password.');
            }
        } catch (err) {
            if (err.message !== 'Session expired') {
                setError('An error occurred while changing the password.');
            }
        }
    };

    return (
        <>
            <Head><title>My Profile - Produit Academy</title></Head>
            <Header />
            <main className="main-content">
                <div className={styles.profileContainer}>
                    <h1 className={styles.profileTitle}>My Profile</h1>

                    {message && <p className={`${styles.message} ${styles.success}`}>{message}</p>}
                    {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

                    <div className={styles.formSection}>
                        <h2 className={styles.formTitle}>Personal Details</h2>
                        <form className={styles.profileForm} onSubmit={handleProfileUpdate}>
                            <label className={styles.label} htmlFor="username">Name</label>
                            <input id="username" type="text" value={profile.username || ''} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />

                            <label className={styles.label} htmlFor="email">Email (cannot be changed)</label>
                            <input id="email" type="email" value={profile.email || ''} readOnly disabled />

                            <label className={styles.label} htmlFor="college">College</label>
                            <input id="college" type="text" placeholder="Your college name" value={profile.college || ''} onChange={(e) => setProfile({ ...profile, college: e.target.value })} />

                            <label className={styles.label} htmlFor="phone">Phone Number</label>
                            <input id="phone" type="text" placeholder="Your phone number" value={profile.phone_number || ''} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} />

                            <button type="submit" className={styles.submitButton}>Update Profile</button>
                        </form>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.formSection}>
                        <h2 className={styles.formTitle}>Change Password</h2>
                        <form className={styles.profileForm} onSubmit={handlePasswordChange}>
                            <input type="password" placeholder="Old Password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                            <input type="password" placeholder="New Password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <button type="submit" className={styles.submitButton}>Update Password</button>
                        </form>
                    </div>
                </div>
            </main>

        </>
    );
}