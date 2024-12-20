"use client";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineHome, AiOutlineInfoCircle, AiOutlineProject, AiOutlineMail } from "react-icons/ai";
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
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">MyPortfolio</Link>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-lg hover:text-purple-400 transition"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <ul className="flex flex-col items-start px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-lg text-white hover:text-purple-400 transition"
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
