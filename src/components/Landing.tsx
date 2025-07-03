import React from "react";
import { Link } from "react-scroll";
import landingImage from "../images/landing-image.png";

const Landing: React.FC = () => {
  return (
    <section
      id="landing"
      className="relative text-white bg-cover bg-center min-h-screen flex flex-col items-center justify-start pt-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('https://www.shutterstock.com/image-illustration/3d-rendering-abstract-technology-background-260nw-1372325117.jpg')",
      }}
    >
      {/* Image Always First */}
      <img
        src={landingImage}
        alt="Landing"
        className="w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] lg:max-h-[90vh] object-contain px-4 sm:px-8 md:px-12 transition-transform scale-100"
      />

      {/* Floating Content on md+ */}
      <div className="hidden md:block absolute top-1/2 left-1/2 w-full px-4 sm:px-6 md:px-10 transform -translate-x-1/2 -translate-y-1/2">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 rounded-xl p-6 sm:p-10 shadow-xl">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="w-20 h-1 bg-blue-400 mb-2" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
                I'M DJ, a Full Stack Web Developer
              </h2>
              <p className="text-white/80 text-justify text-base leading-relaxed">
                Passionate about creating beautiful and functional web experiences. As a Full Stack Web Developer, I
                bring ideas to life through thoughtful design and seamless development. With expertise in front-end and
                back-end technologies, I craft responsive, user-centered applications that deliver both aesthetic appeal
                and powerful functionality.
              </p>
              <Link
                to="contact"
                smooth
                duration={500}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
              >
                GET IN TOUCH
              </Link>
            </div>

            {/* Right Content (hidden on mobile) */}
            <div className="flex flex-col justify-between gap-8 text-white/90">
              {/* About Me */}
              <div>
                <h4 className="text-xl font-semibold mb-2">ABOUT ME</h4>
                <p className="text-sm text-justify leading-relaxed">
                  Hi, I’m DJ, a Full Stack Web Developer dedicated to creating beautiful and functional web experiences.
                  With a background in engineering and a passion for technology, I transitioned to web development to
                  combine my problem-solving skills with my creative side.
                </p>
                <Link
                  to="about"
                  smooth
                  duration={500}
                  className="text-blue-400 mt-2 inline-block underline underline-offset-4 hover:text-blue-300"
                >
                  Learn More →
                </Link>
              </div>

              {/* My Work */}
              <div>
                <h4 className="text-xl font-semibold mb-2">MY WORK</h4>
                <p className="text-sm text-justify leading-relaxed">
                  I develop web applications using Laravel and Vue.js, focusing on creating responsive, functional
                  solutions with seamless front-end and back-end integration.
                </p>
                <Link
                  to="projects"
                  smooth
                  duration={500}
                  className="text-blue-400 mt-2 inline-block underline underline-offset-4 hover:text-blue-300"
                >
                  View Projects →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Static Version (only the left part, no about/my work) */}
      <div className="md:hidden mt-10 px-4 max-w-xl text-center space-y-6">
        <h2 className="text-3xl font-bold">I'M DJ, a Full Stack Web Developer</h2>
        <p className="text-white/80 text-base leading-relaxed">
          Passionate about creating beautiful and functional web experiences. I bring ideas to life through thoughtful
          design and seamless development.
        </p>
        <Link
          to="contact"
          smooth
          duration={500}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          GET IN TOUCH
        </Link>
      </div>
    </section>
  );
};

export default Landing;
