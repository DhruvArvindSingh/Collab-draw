'use client'

import { useState } from 'react'
import "../globals.css"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios';
import './signup.css'

export default function SignupPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const username = formData.get('username')
        const email = formData.get('email')
        const password = formData.get('password')

        try {
            const response = await axios.post('http://localhost:81/signup', {
                username,
                email,
                password
            })

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Something went wrong')
            }
            else {
                console.log("response=", response);
            }

            router.push('/signin')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-box">
                <div>
                    <h2 className="signup-title">
                        Create your account
                    </h2>
                </div>
                <form className="signup-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}
                    <div className="form-fields">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="input-field"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input-field"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="input-field"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </div>
                </form>

                <p className="signin-link-text">
                    Already have an account?{' '}
                    <Link
                        href="/signin"
                        className="signin-link"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
