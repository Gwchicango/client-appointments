"use client";

import React from 'react';
import Link from 'next/link';
import { FaUsers, FaCalendarAlt, FaHome, FaCog, FaSignOutAlt, FaUserMd } from 'react-icons/fa';

const Nav: React.FC = () => {
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        // Aquí puedes agregar la lógica de logout, como limpiar el token de autenticación
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        localStorage.removeItem('idUser');
    };

    return (
        <aside className="fixed top-0 left-0 w-64 bg-blue-950 text-white flex flex-col h-full shadow-lg">
            <div className="p-6 flex items-center justify-center border-b border-blue-700">
                <img src="/images/logo.jpg" alt="Logo" className="w-36 h-16 border rounded-lg" />
            </div>
            <nav className="flex-1 p-6 overflow-y-auto">
                <ul>
                    <li className="mb-4">
                        <Link href="/pages/dashboard" className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <FaHome className="mr-3 text-xl" />
                            <span className="text-lg">Home</span>
                        </Link>
                    </li>
                    {role === 'PATIENT' && (
                        <>
                            <li className="mb-4">
                                <Link href="/pages/doctor" className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <FaUserMd className="mr-3 text-xl" />
                                    <span className="text-lg">Doctores</span>
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/pages/client" className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <FaUsers className="mr-3 text-xl" />
                                    <span className="text-lg">Clientes</span>
                                </Link>
                            </li>
                        </>
                    )}
                    <li className="mb-4">
                        <Link href="/pages/appointments" className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <FaCalendarAlt className="mr-3 text-xl" />
                            <span className="text-lg">Gestión de Citas</span>
                        </Link>
                    </li>
                    {role === 'ADMIN' && (
                        <li className="mb-4">
                            <Link href="/settings" className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <FaCog className="mr-3 text-xl" />
                                <span className="text-lg">Settings</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="p-6 border-t border-blue-700">
                <Link href="/auth/login"
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                    <FaSignOutAlt className="mr-2 text-xl" />
                    <span className="text-lg">Logout</span>
                </Link>
            </div>
        </aside>
    );
};

export default Nav;