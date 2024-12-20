"use client";  // Add this line
import Image from 'next/image';
import React, { useState } from 'react';

const ProjectsSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const projects = [
    {
      imageSrc: 'https://via.placeholder.com/500/FF5733/FFFFFF?text=Weather+App',
      title: 'Weather Report',
      description: 'A React weather application that provides real-time weather information.',
      fullDescription: 'This application fetches real-time data from weather APIs and displays current weather conditions such as temperature, humidity, wind speed, and forecasts for the upcoming days. It is built with React and styled using Tailwind CSS.',
      link: 'https://github.com/sumitachar/weatherApp',
    },
    {
      imageSrc: 'https://via.placeholder.com/500/33FF57/FFFFFF?text=Event+Management',
      title: 'Event Management',
      description: 'A web-based application designed to streamline event planning and management. The system allows users to create, manage, and track events.',
      fullDescription: 'This web application is built for event organizers to manage the entire lifecycle of an event, from creating and scheduling events to managing registrations, guest lists, and ticketing. The app provides real-time updates and notifications to attendees.',
      link: 'https://github.com/sumitachar/event_management.git',
    },
    {
      imageSrc: 'https://via.placeholder.com/500/3357FF/FFFFFF?text=Employee-Bazar',
      title: 'Employee Bazar',
      description: 'A web-based employee portal developed using Next.js and MongoDB. The platform allows employees to manage workplace resources.',
      fullDescription: 'Employee Bazar is a portal for employees to manage leave requests, attendance, payslips, and communicate with HR. Built using Next.js and MongoDB, it ensures data security and efficient management, offering a user-friendly interface for employees and administrators.',
      link: 'https://github.com/sumitachar/employee_bazar.git',
    },
  ];

  const handleToggleDescription = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="projects" className="py-16 bg-gray-900">
      <div className="container mx-auto text-center mb-12">
        <h1 className="text-3xl font-semibold text-white mb-4">Featured Projects</h1>
        <p className="text-lg text-gray-400">Check out some of my work below.</p>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {projects.map((project, index) => (
          <div key={index} className="w-full max-w-xs mx-auto">
            <div className="card bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-indigo-600 hover:border-2 hover:border-indigo-500">
              <div className="relative">
                {/* Image */}
                <Image
                  src={project.imageSrc}
                  alt={project.title}
                  width={500} // Add width and height for optimization
                  height={300}
                  className="w-full h-56 object-cover transition-transform duration-300 transform hover:scale-110"
                />
                {/* Dark Gradient Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-800 to-transparent opacity-40 hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 space-y-4">
                {/* Title */}
                <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                {/* Short Description */}
                <p className="text-sm text-gray-400">{project.description}</p>
                {/* Full Description */}
                {expandedIndex === index ? (
                  <p className="text-sm text-gray-300 mt-4">{project.fullDescription}</p>
                ) : null}
                {/* View Project Button */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full transition duration-300 hover:bg-indigo-700 focus:outline-none"
                >
                  View Project
                </a>
                {/* Toggle Description Button */}
                <button
                  onClick={() => handleToggleDescription(index)}
                  className="mt-4 text-indigo-500 hover:text-indigo-400 transition duration-300"
                >
                  {expandedIndex === index ? 'Show Less' : 'Read More'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
