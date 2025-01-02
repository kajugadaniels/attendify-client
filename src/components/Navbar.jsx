import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api';
import { toast } from 'react-toastify';
import { LogOut, UserRoundPen } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve user information from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(user.name || 'User');
            // Assuming `user.role` is an object, extract its `name` or another property
            setUserRole(user.role_name || 'Role');
        }

        const handleScroll = () => {
            // Set `isScrolled` to true if the page is scrolled down more than 10px
            setIsScrolled(window.scrollY > 10);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('No active session found.');
            return;
        }

        const { success, message } = await logout(token);

        if (success) {
            toast.success(message || 'Logout successful.');
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        } else {
            toast.error(message);
        }
    };

    return (
        <div className={`top-bar absolute left-0 xl:left-3.5 right-0 h-full mx-5 group ${isScrolled ? 'bg-primary rounded-lg px-6' : 'bg-transparent'}`}>
            <div className="container flex items-center w-full h-full transition-all duration-300 ease-in-out">
                <div className="flex items-center gap-1 xl:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-white rounded-full open-mobile-menu hover:bg-white/5"
                    >
                        <div className="stroke-[1] h-[18px] w-[18px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 16 16">
                                <path fill="currentColor" d="M0 1h16v2H0zm0 4h16v2H0zm0 4h16v2H0zm0 4h16v2H0z" />
                            </svg>
                        </div>
                    </button>
                </div>
                <nav aria-label="breadcrumb" className="flex flex-1">
                    <ol className="flex items-center text-theme-1 text-white/90">
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                    </ol>
                </nav>
                <div className="flex items-center flex-1">
                    <div className="relative ml-auto">
                        <div className="flex items-center">
                            <div className="mr-5 text-right">
                                <div className="font-bold text-white text-md">{userName}</div>
                                <span className="text-sm text-white">{userRole}</span>
                            </div>
                            <button
                                onClick={toggleDropdown}
                                aria-expanded={dropdownOpen}
                                className="cursor-pointer image-fit h-[36px] w-[36px] overflow-hidden rounded-full border-[3px] border-white/[0.15]"
                            >
                                <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" alt="EPS" />
                            </button>
                        </div>
                        <div
                            className={`dropdown-menu absolute right-0 mt-2 z-[9999] ${dropdownOpen ? 'block' : 'hidden'}`}
                        >
                            <div className="w-56 p-2 bg-white rounded-md shadow-lg dropdown-content">
                                <Link
                                    to='/profile'
                                    className="flex items-center p-2 transition duration-300 ease-in-out rounded-md hover:bg-gray-100"
                                >
                                    <UserRoundPen className="stroke-[1] mr-2 h-4 w-4" />
                                    Profile Info
                                </Link>
                                <Link
                                    to='/'
                                    // onClick={handleLogout}
                                    className="flex items-center w-full p-2 transition duration-300 ease-in-out rounded-md hover:bg-gray-100"
                                >
                                    <LogOut className="stroke-[1] mr-2 h-4 w-4" />
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
