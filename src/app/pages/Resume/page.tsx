"use client";
import React, { useRef } from "react";
import jsPDF from "jspdf";

const ResumePage: React.FC = () => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4"); // Portrait, mm units, A4 size
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    let yOffset = 20; // Initial vertical position for the content

    // Helper function to check if content exceeds the current page height
    const checkPageOverflow = (textHeight: number) => {
        if (yOffset + textHeight > pageHeight - margin) {
            pdf.addPage();
            yOffset = 20; // Reset Y offset for the new page
        }
    };

    // --- Title ---
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(26);
    pdf.text("Sumit Achar", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 10;

    pdf.setFontSize(14);
    pdf.text("Front-End Developer", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 5; // Space after title

    // --- Separator Line ---
    pdf.setDrawColor(0, 0, 0);
    pdf.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += 10;

    // --- Contact Information ---
    pdf.setFontSize(14);
    pdf.text("Contact Information", margin, yOffset);
    yOffset += 10;

    const contactInfo = `Email: sumitachar1997@gmail.com\nPhone: 8348580207\nLinkedIn: linkedin.com/in/sumitachar\nGitHub: github.com/sumitachar`;
    checkPageOverflow(pdf.getTextDimensions(contactInfo).h);
    pdf.setFontSize(12);
    pdf.text(contactInfo, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
    yOffset += pdf.getTextDimensions(contactInfo).h + 20;

    // --- Summary ---
    pdf.setFontSize(14);
    pdf.text("Summary", margin, yOffset);
    yOffset += 10;
    const summary = "Passionate about creating interactive web applications and constantly improving skills in front-end development.";
    checkPageOverflow(pdf.getTextDimensions(summary).h);
    pdf.setFontSize(12);
    pdf.text(summary, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
    yOffset += pdf.getTextDimensions(summary).h + 20;

    // --- Experience ---
    pdf.setFontSize(14);
    pdf.text("Experience", margin, yOffset);
    yOffset += 10;

    const experienceText = `Junior Software Developer\nVista Intelligence Pvt. Ltd. (2022 - 2023)\n- Implemented dynamic UI features\n- Developed data visualization charts\n- Optimized website responsiveness`;
    checkPageOverflow(pdf.getTextDimensions(experienceText).h);
    pdf.setFontSize(12);
    pdf.text(experienceText, margin, yOffset,{ maxWidth: pageWidth - 2 * margin });
    yOffset += pdf.getTextDimensions(experienceText).h + 30;

    // --- Education ---
    pdf.setFontSize(14);
    pdf.text("Education", margin, yOffset);
    yOffset += 10;

    const educationText = `Master of Computer Application\nHaldia Institute of Technology (2020 - 2022)\nScore: 9.2/10`;
    checkPageOverflow(pdf.getTextDimensions(educationText).h);
    pdf.setFontSize(12);
    pdf.text(educationText, margin, yOffset);
    yOffset += pdf.getTextDimensions(educationText).h + 10;

    const bscText = `B.Sc. in Computer Science\nMahishadal Raj College (2017 - 2020)\nScore: 6.5/10`;
    checkPageOverflow(pdf.getTextDimensions(bscText).h);
    pdf.text(bscText, margin, yOffset);
    yOffset += pdf.getTextDimensions(bscText).h + 20;

    // --- Projects ---
    pdf.setFontSize(14);
    pdf.text("Projects", margin, yOffset);
    yOffset += 10;

    const project1 = `Feedsene - Stock market data analysis platform\nTechnologies: ReactJS, NestJS, PostgreSQL\nDescription: A platform for stock market analysis.`;
    checkPageOverflow(pdf.getTextDimensions(project1).h);
    pdf.setFontSize(12);
    pdf.text(project1, margin, yOffset);
    yOffset += pdf.getTextDimensions(project1).h + 20;

    const project2 = `E-commerce Website - MERN stack application\nTechnologies: MERN, Razorpay\nDescription: E-commerce platform with payment gateway integration.`;
    checkPageOverflow(pdf.getTextDimensions(project2).h);
    pdf.text(project2, margin, yOffset);
    yOffset += pdf.getTextDimensions(project2).h + 20;

    // --- Skills ---
    pdf.setFontSize(14);
    pdf.text("Skills", margin, yOffset);
    yOffset += 10;

    const skills = "ReactJS, JavaScript, CSS, HTML, NodeJS, PostgreSQL, Git";
    checkPageOverflow(pdf.getTextDimensions(skills).h);
    pdf.setFontSize(12);
    pdf.text(skills, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
    yOffset += pdf.getTextDimensions(skills).h + 20;

    // --- Footer (Optional) ---
    // pdf.text("Footer Information", pageWidth / 2, pageHeight - 10, { align: "center" });

    // Save the PDF
    pdf.save("Sumit-Achar-CV.pdf");
};





  const resumeData = {
    name: "Sumit Achar",
    title: "Front-End Developer",
    summary:
      "Passionate about creating interactive web applications and constantly improving skills in front-end development. Looking forward to working on innovative projects that make an impact.",
    contact: {
      email: "sumitachar1997@gmail.com",
      phone: "8348580207",
      linkedIn: "linkedin.com/in/sumitachar",
      github: "github.com/sumitachar",
    },
    experience: [
      {
        role: "Junior Software Developer",
        company: "Vista Intelligence Pvt. Ltd.",
        period: "2022 - 2023",
        tasks: [
          "Implemented dynamic UI features like table row/column reordering and multi-select drop-downs.",
          "Developed data visualization charts by manipulating JSON data.",
          "Optimized website responsiveness for improved user experience.",
        ],
      },
    ],
    education: [
      {
        degree: "Master of Computer Application",
        institution: "Haldia Institute of Technology",
        period: "2020 - 2022",
        score: "9.2/10",
      },
      {
        degree: "B.Sc. in Computer Science",
        institution: "Mahishadal Raj College",
        period: "2017 - 2020",
        score: "6.5/10",
      },
    ],
    projects: [
      {
        name: "Feedsene",
        description:
          "Stock market data analysis platform using ReactJS, NestJS, and PostgreSQL.",
      },
      {
        name: "E-commerce Website",
        description:
          "MERN stack application with Razorpay payment gateway integration.",
      },
    ],
    skills: [
      "ReactJS",
      "JavaScript",
      "CSS",
      "HTML",
      "NodeJS",
      "PostgreSQL",
      "TailwindCSS",
      "Git",
    ],
  };

  return (
    <section
      id="resume-section"
      className="min-h-screen bg-gray-900 text-white py-12 px-4 md:px-16 lg:px-24"
    >
      <div
        ref={resumeRef}
        className="resume-container max-w-3xl mx-auto bg-gray-800 text-white shadow-lg rounded-lg p-8"
      >
        {/* Header */}
        <div className="text-center border-b border-gray-600 pb-6 mb-8">
          <h1 className="text-4xl font-bold">{resumeData.name}</h1>
          <h2 className="text-lg text-gray-400 mt-2">{resumeData.title}</h2>
          <p className="text-gray-300 mt-4">{resumeData.summary}</p>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Contact</h3>
          <ul className="list-none space-y-2">
            <li>Email: {resumeData.contact.email}</li>
            <li>Phone: {resumeData.contact.phone}</li>
            <li>LinkedIn: {resumeData.contact.linkedIn}</li>
            <li>GitHub: {resumeData.contact.github}</li>
          </ul>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Experience</h3>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-bold">{exp.role}</h4>
              <p className="text-sm text-gray-400">
                {exp.company} ({exp.period})
              </p>
              <ul className="list-disc ml-5 mt-2 text-gray-300">
                {exp.tasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-bold">{edu.degree}</h4>
              <p className="text-sm text-gray-400">
                {edu.institution} ({edu.period})
              </p>
              <p className="text-sm">Score: {edu.score}</p>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Projects</h3>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-bold">{project.name}</h4>
              <p>{project.description}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Skills</h3>
          <p>{resumeData.skills.join(", ")}</p>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center mt-8">
        <button
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
          onClick={handleDownloadPDF}
        >
          Download CV
        </button>
      </div>

      <style jsx>{`
        .light-mode {
          background: white !important;
          color: black !important;
        }
      `}</style>
    </section>
  );
};

export default ResumePage;
