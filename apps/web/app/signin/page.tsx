'use client';
import styles from "./page.module.css";
import "../globals.css"
import axios from 'axios';
import Cookies from 'js-cookie';
import { HTTP_URL } from "../../config/index";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle sign in logic here
        try {
            let response;
            console.log(`${HTTP_URL}/signin`);
            try{
                response = await axios.post(`${HTTP_URL}/signin`, formData);
                console.log("response", response);
                console.log("response.data", response.data);
            }catch(error){
                console.error('Error while fetching data:', error);
                return;
            }
            if(response.status === 200 && response.data.cookie !== null){
                Cookies.set("token", response.data.cookie);
                localStorage.setItem("token", response.data.cookie);
                router.push(`/`);
            }

        } catch (error) {
            console.error('Sign in error:', error);
        }
    };

    return (
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <h2 onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>ChatRooms</h2>
                </div>
            </nav>

            <main className={styles.main}>
                <div className={styles.authContainer}>
                    <h1>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to continue to ChatRooms</p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.primary} onClick={handleSubmit}>
                            Sign In
                        </button>
                    </form>

                    <p className={styles.switchAuth}>
                        Don't have an account?{' '}
                        <span onClick={() => router.push('/signup')} className={styles.link}>
                            Sign Up
                        </span>
                    </p>
                </div>
            </main>
        </div>
    );
}
