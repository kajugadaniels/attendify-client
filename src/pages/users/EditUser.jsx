import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CloudUpload, Eye, Lightbulb, ToggleLeft } from 'lucide-react';
import Select from 'react-select';
import { fetchUserDetails, updateUser } from '../../api';

const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' },
    // Add more role options as needed
];

const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // user ID from the URL

    // Manage form state with pre-populated values
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    // State for live validation errors
    const [errors, setErrors] = useState({
        phone_number: '',
        email: '',
        password: ''
    });

    // Track loading state for submit button and data loading
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Validation functions (similar to AddUser.jsx)
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhoneNumber = (phone) => {
        const regex = /^[0-9]+$/;
        return regex.test(phone);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // Fetch existing user data on component mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await fetchUserDetails(id);
                // Pre-populate form fields; do not populate password fields
                setFormData((prev) => ({
                    ...prev,
                    name: data.name || '',
                    role: data.role || '',
                    phone_number: data.phone_number || '',
                    email: data.email || ''
                }));
            } catch (error) {
                toast.error('Failed to load user details.');
            } finally {
                setDataLoading(false);
            }
        };
        loadUser();
    }, [id]);

    // Handle input changes and perform live validations
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Live validations for phone, email and password
        if (name === 'phone_number') {
            if (!validatePhoneNumber(value)) {
                setErrors((prev) => ({
                    ...prev,
                    phone_number: 'Phone number must contain only digits.'
                }));
            } else {
                setErrors((prev) => ({ ...prev, phone_number: '' }));
            }
        }
        if (name === 'email') {
            if (!validateEmail(value)) {
                setErrors((prev) => ({
                    ...prev,
                    email: 'Invalid email format.'
                }));
            } else {
                setErrors((prev) => ({ ...prev, email: '' }));
            }
        }
        if (name === 'password') {
            if (value && !validatePassword(value)) {
                setErrors((prev) => ({
                    ...prev,
                    password: 'Password must be at least 6 characters long.'
                }));
            } else {
                setErrors((prev) => ({ ...prev, password: '' }));
            }
        }
    };

    // Handle form submission for updating the user
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic check for password confirmation if password is provided
        if (formData.password || formData.password_confirmation) {
            if (formData.password !== formData.password_confirmation) {
                toast.error('Passwords do not match!');
                return;
            }
        }

        // Check for any live validation errors
        if (errors.phone_number || errors.email || errors.password) {
            toast.error('Please fix the errors before submitting.');
            return;
        }

        try {
            setLoading(true);
            // Prepare data to update. Omit password fields if blank.
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
                delete updateData.password_confirmation;
            }
            await updateUser(id, updateData);
            toast.success('User updated successfully!');
            navigate('/users');
        } catch (error) {
            toast.error('Failed to update user. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) {
        return <div>Loading user details...</div>;
    }

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Edit User</h2>
                <a
                    href="/users"
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 bg-primary border-primary text-white dark:border-primary mr-2 shadow-md"
                >
                    Go Back
                    <span className="flex h-5 w-5 items-center justify-center">
                        <Eye className="stroke-1.5 h-4 w-4" />
                    </span>
                </a>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-5 grid grid-cols-11 gap-x-6 pb-20">
                    <div className="intro-y col-span-11 2xl:col-span-9">
                        <div className="intro-y box mt-5 p-5">
                            <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                                <div className="flex items-center border-b border-slate-200/60 pb-5 text-base font-medium dark:border-darkmode-400">
                                    Edit User
                                </div>
                                <div className="mt-5">
                                    {/* Name & Role */}
                                    <div className="block sm:flex group form-inline mt-5 flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:!mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Name & Role</div>
                                                    <div className="ml-2 rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-darkmode-300 dark:text-slate-400">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the user’s full name and select a role.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter user name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                required
                                            />
                                            <Select
                                                name="role"
                                                options={roleOptions}
                                                value={roleOptions.find(option => option.value === formData.role)}
                                                onChange={(selectedOption) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        role: selectedOption ? selectedOption.value : ''
                                                    }))
                                                }
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                placeholder="Select Role"
                                                isClearable
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number & Email Address */}
                                    <div className="block sm:flex group form-inline mt-5 flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:!mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Phone Number & Email</div>
                                                    <div className="ml-2 rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-darkmode-300 dark:text-slate-400">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the user’s unique phone number and email address.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="phone_number"
                                                placeholder="Enter user phone number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                required
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Enter user email address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="block sm:flex group form-inline mt-5 flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:!mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Password</div>
                                                    <div className="ml-2 rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-darkmode-300 dark:text-slate-400">
                                                        Optional
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Enter a new password to update or leave blank to keep current.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-2 gap-3">
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Enter new password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                            />
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                placeholder="Confirm new password"
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-5 flex flex-col justify-end gap-2 md:flex-row">
                                <a
                                    href="/users"
                                    type="button"
                                    className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 bg-white dark:bg-darkmode-800 text-slate-500 dark:text-slate-300 dark:focus:ring-slate-700 w-full py-3 md:w-52"
                                >
                                    Cancel
                                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                                        <ToggleLeft className="stroke-1.5 h-4 w-4" />
                                    </span>
                                </a>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 bg-primary border-primary text-white w-full py-3 md:w-52 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <span className="mr-2">Saving</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="1.4rem"
                                                height="1.4rem"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="#fff"
                                                    strokeWidth="4"
                                                    strokeDasharray="31.415, 31.415"
                                                >
                                                    <animateTransform
                                                        attributeName="transform"
                                                        type="rotate"
                                                        from="0 12 12"
                                                        to="360 12 12"
                                                        dur="1s"
                                                        repeatCount="indefinite"
                                                    />
                                                </circle>
                                            </svg>
                                        </div>
                                    ) : (
                                        'Save'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="intro-y col-span-2 hidden 2xl:block">
                        <div className="sticky top-0">
                            <div className="relative mt-6 rounded-md border border-warning bg-warning/20 p-5 dark:border-0 dark:bg-darkmode-600">
                                <Lightbulb className="stroke-1.5 absolute right-0 top-0 mr-3 mt-5 h-12 w-12 text-warning/80" />
                                <h2 className="text-lg font-medium">Tips</h2>
                                <div className="mt-5 font-medium">Hiring</div>
                                <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-500">
                                    Ensure that all required fields are updated correctly. Leaving password fields blank will retain the current password.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditUser;
