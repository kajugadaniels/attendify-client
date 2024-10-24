import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, FileUser, House, Tractor, User } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    // Function to check if a route is active
    const isActive = (path) => location.pathname === path;

    const user = JSON.parse(localStorage.getItem('user'));  // Get the user object
    const userPermissions = user?.user_permissions || [];  // Retrieve user permissions

    // Function to check if a permission is available in either user or role permissions
    const hasPermission = (permission) => {
        // Check for both "users.permission" and "permission"
        const prefixedPermission = `users.${permission}`;

        return (
            userPermissions.includes(prefixedPermission) || 
            userPermissions.includes(permission)
        );
    };

    return (
        <>
            <div className="flex-none hidden xl:flex items-center z-10 px-5 h-[65px] w-[275px] overflow-hidden relative duration-300 group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]">
                <Link className="flex items-center transition-[margin] duration-300 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-0 group-[.side-menu--collapsed]:xl:ml-2" to="/dashboard">
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-white transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:xl:-rotate-180">
                        <img src='https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg' alt="EPS Logo" />
                    </div>
                    <div className="ml-3.5 font-medium transition-opacity group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0">
                        EPS
                    </div>
                </Link>
            </div>

            <div className="scrollable-ref w-full h-full z-20 px-5 overflow-y-auto overflow-x-hidden pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent [&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30">
                <ul className="scrollable">
                    <li className={isActive('/dashboard') ? 'bg-white text-primary/10 border rounded-lg border-primary/10' : ''}>
                        <Link to="/dashboard" className="side-menu__link">
                            <House className="stroke-[1] w-5 h-5 side-menu__link__icon" />
                            <div className="side-menu__link__title">Dashboard</div>
                        </Link>
                    </li>
                    <li className={isActive('/users') ? 'bg-white text-primary/10 border rounded-lg border-primary/10' : ''}>
                        <Link to="/users" className="side-menu__link">
                            <User className="stroke-[1] w-5 h-5 side-menu__link__icon" />
                            <div className="side-menu__link__title">User</div>
                        </Link>
                    </li>
                    <li className={isActive('/employees') ? 'bg-white text-primary/10 border rounded-lg border-primary/10' : ''}>
                        <Link to="/employees" className="side-menu__link">
                            <FileUser className="stroke-[1] w-5 h-5 side-menu__link__icon" />
                            <div className="side-menu__link__title">Employees</div>
                        </Link>
                    </li>
                    <li className={isActive('/departments') ? 'bg-white text-primary/10 border rounded-lg border-primary/10' : ''}>
                        <Link to="/departments" className="side-menu__link">
                            <Briefcase className="stroke-[1] w-5 h-5 side-menu__link__icon" />
                            <div className="side-menu__link__title">Departments</div>
                        </Link>
                    </li>
                    <li className={isActive('/fields') ? 'bg-white text-primary/10 border rounded-lg border-primary/10' : ''}>
                        <Link to="/fields" className="side-menu__link">
                            <Tractor className="stroke-[1] w-5 h-5 side-menu__link__icon" />
                            <div className="side-menu__link__title">Fields</div>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
