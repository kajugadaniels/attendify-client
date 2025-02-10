import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { updateUser } from '../api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
        role: '',
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser({
                name: storedUser.name || '',
                email: storedUser.email || '',
                phone_number: storedUser.phone_number || '',
                password: '',
                confirmPassword: '',
                role: storedUser.role || 'N/A',
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password and confirm password match
        if (user.password && user.password !== user.confirmPassword) {
            toast.error('Passwords do not match. Please ensure both password fields are the same.');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
            };
            // Include password only if it's provided
            if (user.password) {
                payload.password = user.password;
            }

            const response = await updateUser(payload);
            toast.success(response.message || 'Account updated successfully.');

            // Update local storage with the new user data
            localStorage.setItem('user', JSON.stringify(response.user));

            // Redirect back to the profile page with updated data
            navigate('/profile');
        } catch (error) {
            setLoading(false);
            const errorMessage = extractErrorMessage(error);
            toast.error(errorMessage);
        }
    };

    const extractErrorMessage = (error) => {
        if (error.response) {
            const { data, status } = error.response;
            if (status === 400) {
                return data.message || 'Validation error. Please check the input fields.';
            }
            if (status === 401) {
                return 'You are not authorized to perform this action.';
            }
            if (status === 404) {
                return 'User not found. Please refresh the page and try again.';
            }
            if (status === 500) {
                return 'Server error. Please try again later.';
            }
        }
        return 'An unexpected error occurred. Please try again.';
    };

    return (
        <div className="px-5 mt-16">
            <div className="container">
                <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                    <div className="col-span-12 sm:col-span-10 sm:col-start-2">
                        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                            <div className="text-base font-medium group-[.mode--light]:text-white">
                                Update Profile
                            </div>
                        </div>
                        <div className="mt-7">
                            <div className="flex flex-col box box--stacked">
                                <form onSubmit={handleSubmit} className="p-7">
                                    {/* Name */}
                                    <div className="flex-col block pt-5 mt-5 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Full Name</div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-darkmode-300 dark:text-slate-400">Required</div>
                                                </div>
                                                <div className="mt-1.5 text-xs leading-relaxed text-slate-500/80 xl:mt-3">
                                                    Enter your full legal name as it appears on your official identification.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <input
                                                type="text"
                                                name="name"
                                                value={user.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter full name"
                                                className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email & Phone Number */}
                                    <div className="flex-col block pt-5 mt-5 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Password</div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-darkmode-300 dark:text-slate-400">Optional</div>
                                                </div>
                                                <div className="mt-1.5 text-xs leading-relaxed text-slate-500/80 xl:mt-3">
                                                    Provide your email address for communication, notifications, account recovery and account verification.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <div className="flex flex-col items-center md:flex-row">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={user.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter email address"
                                                    className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    name="phone_number"
                                                    value={user.phone_number}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter phone number"
                                                    className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Section */}
                                    <div className="flex-col block pt-5 mt-5 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Password</div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-darkmode-300 dark:text-slate-400">Optional</div>
                                                </div>
                                                <div className="mt-1.5 text-xs leading-relaxed text-slate-500/80 xl:mt-3">
                                                    Enter a new password if you wish to change it.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <div className="flex flex-col items-center md:flex-row">
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={user.password}
                                                    onChange={handleInputChange}
                                                    placeholder="New Password"
                                                    className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={user.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm Password"
                                                    className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role (Read-only) */}
                                    <div className="flex-col block pt-5 mt-5 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Role</div>
                                                </div>
                                                <div className="mt-1.5 text-xs leading-relaxed text-slate-500/80 xl:mt-3">
                                                    Your current role within the system.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <input
                                                type="text"
                                                value={user.role}
                                                className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="flex py-5 border-t border-slate-200/80 px-7 md:justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex items-center justify-center w-full px-10 py-2 font-medium transition border rounded-md shadow-sm text-primary border-primary md:w-auto"
                                        >
                                            <Save className="-ml-2 mr-2 h-4 w-4 stroke-[1.3]" />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
