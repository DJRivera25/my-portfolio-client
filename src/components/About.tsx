import React from "react";
import aboutImage from "../images/about-image.png";

const About: React.FC = () => {
  return (
    <section id="about" className="bg-black text-white py-16 border-t border-yellow-300">
      <div className="container mx-auto px-4 text-">
        <h2 className="text-center text-4xl font-bold mb-10">ABOUT ME</h2>

        <div className="flex flex-col xl:flex-row items-center justify-center gap-10">
          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={aboutImage}
              alt="About"
              className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full object-contain bg-[#fffc67] border border-[#152e89]"
            />
          </div>

          {/* About Text */}
          <div className="max-w-2xl text-lg leading-relaxed">
            <p className="mb-6 font-semibold text-justify">
              I’m Derem Joshua Rivera, a Full Stack Web Developer who transforms ideas into engaging digital solutions.
              With roots in engineering and a strong drive to innovate, I transitioned into web development to merge my
              technical expertise with a passion for building creative, user-centered experiences.
            </p>
            <p className="mb-6 font-semibold text-justify">
              I specialize in building intuitive, responsive applications that serve both users and business goals. From
              designing seamless front-end interfaces with Vue.js to developing powerful back-end systems using Laravel,
              I thrive in every stage of the development process.
            </p>
            <p className="font-semibold text-justify">
              My mission is to help individuals and organizations succeed in the digital space through thoughtful,
              efficient, and impactful solutions. Outside of coding, I enjoy spending time with my family, studying the
              Word of God, and playing guitar — using my gifts to glorify Him and serve others.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
