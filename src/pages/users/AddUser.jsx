import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CloudUpload, Eye, Lightbulb, ToggleLeft } from 'lucide-react'

const AddUser = () => {
    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">
                    Add User
                </h2>
                <a
                    href='/users'
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 bg-primary border-primary text-white dark:border-primary mr-2 shadow-md"
                >
                    Go Back
                    <span className="flex h-5 w-5 items-center justify-center">
                        <Eye className="stroke-1.5 h-4 w-4" />
                    </span>
                </a>
            </div>

            <form>
                <div className="mt-5 grid grid-cols-11 gap-x-6 pb-20">
                    <div className="intro-y col-span-11 2xl:col-span-9">
                        <div className="intro-y box mt-5 p-5">
                            <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                                <div className="flex items-center border-b border-slate-200/60 pb-5 text-base font-medium dark:border-darkmode-400">
                                    Add New User
                                </div>
                                <div className="mt-5">
                                    {/* Name & Email */}
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
                                                    Please enter the user’s full name and a role.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter user name"
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                required
                                            />
                                            <select
                                                name="role"
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                required
                                            >
                                                <option value="">Select Role</option>
                                                <option value="Admin">Admin</option>
                                                <option value="User">User</option>
                                            </select>
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
                                                type="email"
                                                name="phone_number"
                                                placeholder="Enter user phone number"
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                required
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Enter user email address"
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
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the user’s unique password.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-2 gap-3">
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Enter user password"
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                required
                                            />
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                placeholder="Password Confirmation"
                                                className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                required
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
                                    className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 bg-primary border-primary text-white dark:border-primary w-full py-3 md:w-52 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    Save
                                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                                        <CloudUpload className="stroke-1.5 h-4 w-4" />
                                    </span>
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
                                    <div>
                                        Provide correct details to ensure the system
                                        accurately manages attendance and payroll.
                                        Double-check salary, finger ID, and phone number
                                        for accuracy before saving.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddUser