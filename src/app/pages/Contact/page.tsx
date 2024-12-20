import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFileDownload } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  return (
    <section id="contact-section" className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto text-center mb-12">
        <div className="pb-8">
          <h1 className="text-5xl font-extrabold text-indigo-500">Contact</h1>
          <h2 className="text-3xl mt-4 text-gray-300">Contact Me</h2>
          <p className="mt-4 text-xl text-gray-400">Here are the details to reach out to me!</p>
        </div>

        <div className="contact-info grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          {/* Address Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl hover:ring-4 hover:ring-indigo-500 transition-all duration-300 transform hover:scale-105 hover:border-indigo-600 border-2 border-transparent">
            <div className="icon w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-full mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <FaMapMarkerAlt className="text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">Address</h3>
            <p className="text-gray-300">Kolkata, India</p>
          </div>

          {/* Phone Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl hover:ring-4 hover:ring-indigo-500 transition-all duration-300 transform hover:scale-105 hover:border-indigo-600 border-2 border-transparent">
            <div className="icon w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-full mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <FaPhoneAlt className="text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">Contact Number</h3>
            <p className="text-gray-300">8348580207</p>
          </div>

          {/* Email Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl hover:ring-4 hover:ring-indigo-500 transition-all duration-300 transform hover:scale-105 hover:border-indigo-600 border-2 border-transparent">
            <div className="icon w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-full mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <FaEnvelope className="text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">Email Address</h3>
            <p className="text-gray-300">
              <a href="mailto:sumitachar89@gmail.com" className="hover:text-indigo-400 transition-all duration-300">sumitachar89@gmail.com</a>
            </p>
          </div>

          {/* Resume Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl hover:ring-4 hover:ring-indigo-500 transition-all duration-300 transform hover:scale-105 hover:border-indigo-600 border-2 border-transparent">
            <div className="icon w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-full mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <FaFileDownload className="text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">Download Resume</h3>
            <p className="text-gray-300">
              {/* The resume link */}
              <a 
                href="/resume.pdf" 
                download 
                className="hover:text-indigo-400 transition-all duration-300"
              >
                Resume Link
              </a>
            </p>
          </div>
        </div>

        {/* Question Section */}
        <div className="mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              Have a <span className="text-indigo-400">Question?</span>{' '}
              <a href="https://forms.gle/F9Udn855qkAcBo4p9" className="py-3 px-5 bg-indigo-500 text-white rounded-lg mt-4 inline-block hover:bg-indigo-600 transition-all duration-300">
                Click Here
              </a>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
