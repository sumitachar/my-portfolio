"use client";
import Link from "next/link";
import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlineProject,
  AiOutlineMail,
} from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: <AiOutlineHome /> },
    { href: "/pages/About", label: "About", icon: <AiOutlineInfoCircle /> },
    { href: "/pages/Resume", label: "Resume", icon: <BiUser /> },
    { href: "/pages/Project", label: "Projects", icon: <AiOutlineProject /> },
    { href: "/pages/Contact", label: "Contact", icon: <AiOutlineMail /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-800 via-gray-900 to-black text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          <Link href="/">MyPortfolio</Link>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl text-purple-300 focus:outline-none hover:text-purple-500 transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white hover:scale-110 transition duration-300"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-800 via-gray-900 to-black border-t border-gray-700">
          <ul className="flex flex-col items-start px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.href} className="w-full">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-gray-300 w-full p-2 rounded-md hover:bg-purple-600 hover:text-white transition"
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
