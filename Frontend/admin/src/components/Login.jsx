import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotEmailSent, setForgotEmailSent] = useState(false);

    // Fixed admin credentials for testing
    const admins = [
        { email: 'admin1@example.com', password: 'admin123' },
        { email: 'admin2@example.com', password: 'secure456' }
    ];

    // Check for saved credentials on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('adminEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    // Animation for the form fields
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Save email if remember me is checked
        if (rememberMe) {
            localStorage.setItem('adminEmail', email);
        } else {
            localStorage.removeItem('adminEmail');
        }

        // Simulate network request
        setTimeout(() => {
            // Check if credentials match any admin
            const isValidAdmin = admins.some(
                admin => admin.email === email && admin.password === password
            );

            if (isValidAdmin) {
                // Reset error if any
                setError('');
                // Success animation before redirect
                setTimeout(() => {
                    // Redirect to admin page
                    window.location.href = '/admin';
                }, 1000);
            } else {
                // Show error message
                setError('Invalid email or password');
                setIsLoading(false);
            }
        }, 800);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();

        // Simple validation
        if (!forgotEmail.trim()) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);

        // Simulate sending reset email
        setTimeout(() => {
            const adminExists = admins.some(admin => admin.email === forgotEmail);

            if (adminExists) {
                setForgotEmailSent(true);
                setError('');
            } else {
                setError('Email not found in our records');
            }

            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 via-gray-200 to-gray-200">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-2xl"
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center"
                >
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        {showForgotPassword ? 'Reset Password' : 'Admin Portal'}
                    </h1>

                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 text-sm text-red-800 bg-red-100 rounded-md border-l-4 border-red-500"
                    >
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </motion.div>
                )}

                {forgotEmailSent && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 text-sm text-green-800 bg-green-100 rounded-md border-l-4 border-green-500"
                    >
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Password reset link has been sent to your email
                        </div>
                    </motion.div>
                )}

                {!showForgotPassword ? (
                    <motion.form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 block w-full px-4 py-3 text-gray-700 bg-white bg-opacity-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 block w-full px-4 py-3 text-gray-700 bg-white bg-opacity-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`relative flex justify-center w-full px-6 py-3 text-sm font-medium text-white transition-all duration-300 rounded-lg ${isLoading ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign in'
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.form>
                ) : (
                    <motion.form
                        className="space-y-6"
                        onSubmit={handleForgotPassword}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <p className="mb-4 text-sm text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
                            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    id="forgot-email"
                                    name="forgot-email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="pl-10 block w-full px-4 py-3 text-gray-700 bg-white bg-opacity-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col space-y-3">
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`relative flex justify-center w-full px-6 py-3 text-sm font-medium text-white transition-all duration-300 rounded-lg ${isLoading ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                disabled={isLoading || forgotEmailSent}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </motion.button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setForgotEmail('');
                                    setForgotEmailSent(false);
                                    setError('');
                                }}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                            >
                                Back to login
                            </button>
                        </motion.div>
                    </motion.form>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-6 text-center"
                >
                    {/* Test credentials section is commented out in the original code */}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;