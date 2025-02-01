import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.info('You have been logged out.');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { success, data, message } = await login(email, password);

            if (success) {
                toast.success('Login successful!');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container grid grid-cols-12 px-5 py-10 sm:px-10 sm:py-14 md:px-36 lg:h-screen lg:max-w-[1550px] lg:py-0 lg:pl-14 lg:pr-12 xl:px-24 2xl:max-w-[1750px]">
                <div className="relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0 before:content-[''] before:absolute before:inset-0 before:-mb-3.5 before:bg-white/40 before:rounded-2xl before:mx-5">
                    <div className="relative z-10 flex flex-col justify-center w-full h-full py-2 lg:py-32">
                        <div className="flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
                            {/*<img src='/src/assets/logo-b.png' alt="Logo" />*/}
                        </div>
                        <div>
                            <div className="text-2xl font-medium">Sign In</div>
                            <div className="mt-2.5 text-slate-600">
                                Welcome to CAPS.
                            </div>
                            <form onSubmit={handleLogin} className="mt-6">
                                <label className="inline-block mb-2 group-[.form-inline]:mb-2 group-[.form-inline]:sm:mb-0 group-[.form-inline]:sm:mr-5 group-[.form-inline]:sm:text-right">Email
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter email address"
                                    className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm shadow-sm placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10 block rounded-[0.6rem] border-slate-300/80 px-4 py-3.5"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label className="inline-block mb-2 group-[.form-inline]:mb-2 group-[.form-inline]:sm:mb-0 group-[.form-inline]:sm:mr-5 group-[.form-inline]:sm:text-right mt-4">Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="************"
                                    className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm shadow-sm placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10 block rounded-[0.6rem] border-slate-300/80 px-4 py-3.5"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="mt-5 text-center xl:mt-8 xl:text-left">
                                    <button
                                        type='submit'
                                        className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-primary border-primary text-white dark:border-primary rounded-full w-full bg-gradient-to-r from-theme-1/70 to-theme-2/70 py-3.5 xl:mr-3"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container fixed inset-0 grid h-screen w-screen grid-cols-12 pl-14 pr-12 lg:max-w-[1550px] xl:px-24 2xl:max-w-[1750px]">
                <div className="relative h-screen col-span-12 lg:col-span-5 2xl:col-span-4 z-20 after:bg-white after:hidden after:lg:block after:content-[''] after:absolute after:right-0 after:inset-y-0 after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] before:content-[''] before:hidden before:lg:block before:absolute before:right-0 before:inset-y-0 before:my-6 before:bg-gradient-to-b before:from-white/10 before:to-slate-50/10 before:bg-white/50 before:w-[800%] before:-mr-4 before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0]"></div>
                <div className="h-full col-span-7 2xl:col-span-8 lg:relative before:content-[''] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:w-screen before:lg:w-[800%]">
                    <div className="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36">
                        <div className="text-[2.6rem] font-medium leading-[1.4] text-white xl:text-5xl xl:leading-[1.2]">
                        CASUALS ATTENDANCE AND PAYMENT SYSTEM
                        </div>
                        <div className="mt-5 text-base leading-relaxed text-white/70 xl:text-lg">
                        The Casuals Attendance and Payment System is a digital solution designed to track the attendance of casual workers and automate their payment processing. 
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;