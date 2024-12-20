"use client";
import React from "react";
import Image from 'next/image';

const AboutPage: React.FC = () => {
  const skills = [
    { name: "HTML", level: 80 },
    { name: "CSS", level: 75 },
    { name: "JavaScript", level: 85 },
    { name: "React", level: 80 },
    { name: "Node.js", level: 70 },
    { name: "SQL", level: 65 },
  ];

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-gray-800 to-black px-6 py-16"
      style={{
        animation: "fadeIn 2s ease-in-out",
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="container mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
        {/* Left Column */}
        <div className="space-y-8">
          {/* About Me Section */}
          <div>
            <h2 className="text-4xl font-extrabold text-white opacity-0 animate-fadeInUp delay-300">
              About Me
            </h2>
            <p className="text-lg text-gray-300 mt-4 opacity-0 animate-fadeInUp delay-500">
              I am a software developer with Two years of experience, passionate about building responsive, user-friendly web applications. I specialize in front-end technologies and backend development. My goal is to create seamless user experiences while delivering efficient code.
            </p>
          </div>

          {/* Profile Details */}
          <div>
            <ul className="text-gray-300 mt-6 space-y-3 opacity-0 animate-fadeInUp delay-700">
              <li>
                <span className="font-semibold text-blue-400">Profile:</span> Software Developer
              </li>
              <li>
                <span className="font-semibold text-blue-400">Domain:</span> Web Development
              </li>
              <li>
                <span className="font-semibold text-blue-400">Education:</span> Master of Computer Application
              </li>
              <li>
                <span className="font-semibold text-blue-400">Languages:</span> English, Hindi
              </li>
              <li>
                <span className="font-semibold text-blue-400">Interests:</span> Traveling, Photography, Teaching
              </li>
            </ul>
          </div>

          {/* Projects and LinkedIn */}
          <div className="mt-8 opacity-0 animate-fadeInUp delay-900">
            <p className="text-xl font-semibold text-white">2+ Projects Completed</p>
            <a
              href="https://www.linkedin.com/in/sumit-achar/"
              target="_blank"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Visit LinkedIn
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Profile Image and Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 opacity-0 animate-fadeInUp delay-1000">
            <Image
              src="/bg3.JPG"
              alt="Profile"
              width={120}  // Set appropriate width
              height={120}
              className="rounded-full shadow-lg border-4 border-white transition-transform transform hover:scale-110"
            />
            <div>
              <p className="text-lg font-semibold">Name: Sumit Achar</p>
              <p className="text-lg">Job Role: Software Developer</p>
              <p className="text-lg">Experience: 2 Years</p>
              <p className="text-lg">Location: Kolkata, India</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-4 opacity-0 animate-fadeInUp delay-1200">
              Skills
            </h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="space-y-2 opacity-0 animate-fadeInUp delay-1400"
                >
                  <div className="flex justify-between">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500 transform scale-100 hover:scale-105"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
