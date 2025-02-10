import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Sidebar, Navbar } from '../components';

const UserLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You must be logged in to access this page.');
            navigate('/'); // Redirect to the login page
        }
    }, [navigate]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="echo group bg-gradient-to-b from-slate-200/70 to-slate-50 background relative min-h-screen before:content-[''] before:h-[370px] before:w-screen before:bg-gradient-to-t before:from-theme-1/80 before:to-theme-2 [&.background--hidden]:before:opacity-0 before:transition-[opacity,height] before:ease-in-out before:duration-300 before:top-0 before:fixed after:content-[''] after:h-[370px] after:w-screen [&.background--hidden]:after:opacity-0 after:transition-[opacity,height] after:ease-in-out after:duration-300 after:top-0 after:fixed after:bg-texture-white after:bg-contain after:bg-fixed after:bg-[center_-13rem] after:bg-no-repeat">
            <div className={`side-menu xl:ml-0 shadow-xl transition-[margin,padding] duration-300 xl:shadow-none fixed top-0 left-0 z-50 group inset-y-0 xl:py-3.5 xl:pl-3.5 ${isSidebarOpen ? 'ml-0' : '-ml-[275px]'} xl:ml-0`}>
                {/* Close Sidebar Button */}
                <div className={`fixed ml-[275px] w-10 h-10 items-center justify-center xl:hidden z-50 ${isSidebarOpen ? 'flex' : 'hidden'}`}>
                    <button onClick={closeSidebar} className="mt-5 ml-5 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 32 32">
                            <path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z"/>
                        </svg>
                    </button>
                </div>
                <div className="side-menu__content h-full box bg-white/[0.95] rounded-none xl:rounded-xl z-20 relative w-[275px] duration-300 transition-[width] overflow-hidden flex flex-col">
                    <Sidebar />
                </div>
                <div className="fixed inset-x-0 top-0 mt-3.5 h-[65px] transition-[margin] duration-100 xl:ml-[275px]">
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>
            </div>
            <div className="content transition-[margin,width] duration-100 xl:pl-3.5 pt-[54px] pb-16 relative z-10 group mode xl:ml-[275px] mode--light [&.content--compact]:xl:ml-[91px]">
                <Outlet />
            </div>
        </div>
    );
};

export default UserLayout;
