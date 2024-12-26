"use client";  // Add this line
import React from "react";
import Image from 'next/image';

const Home: React.FC = () => {
    return (
        <section
            id="home-section"
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-6"
        >
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Left Section: Profile Image with Animation */}
                <div className="flex-1 flex items-center justify-center relative">
                    <div className="relative z-10">
                        <Image
                            src="/bg3.JPG"
                            alt="Profile"
                            width={320}  // Set appropriate width
                            height={320} // Set appropriate height
                            className="rounded-full shadow-2xl border-4 border-green-400"
                        />
                    </div>
                    {/* Animated Circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-40 h-40 sm:w-52 sm:h-52 bg-green-500 bg-opacity-20 rounded-full animate-pulse"></div>
                        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 bg-green-500 bg-opacity-10 rounded-full animate-bounce"></div>
                    </div>
                </div>

                {/* Right Section: Introduction */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <p>Hello, I&apos;m</p>

                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            Sumit Achar
                        </span>
                    </h1>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        A passionate Frontend Developer creating visually stunning, user-friendly, and efficient web
                        applications. I specialize in building engaging digital experiences.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <a
                            href="https://github.com/sumitachar/my-portfolio"
                            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition"
                        >
                            My Portfolio
                        </a>
                        <a
                            href="/pages/Contact"
                            className="px-6 py-3 border-2 border-green-400 text-green-400 font-bold rounded-lg hover:bg-green-400 hover:text-white transition"
                        >
                            Contact Me
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
