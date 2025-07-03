import React from "react";
import instagram from "../images/instagram.png";

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="bg-cover bg-center bg-no-repeat py-20 px-4 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2pvYjEzNjItYmctMDdfMS5qcGc.jpg')",
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="w-24 h-1 bg-white mb-10"></div>
        <h2 className="text-4xl font-bold mb-10">Let's work together</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Get in touch with Me</h3>
            <p className="mb-6 leading-relaxed">
              If you have a project in mind, a question to ask, or just want to connect, I’d love to hear from you.
            </p>
            <h4 className="text-xl font-medium mb-3">Follow Me:</h4>
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                instagram,
                "https://freepnglogo.com/images/all_img/1730342312_black-facebook-logo.png",
                "https://freepnglogo.com/images/all_img/1715491541linkedin-logo-transparent.png",
                "https://freepnglogo.com/images/all_img/1707226109new-twitter-logo-png.png",
                "https://freepnglogo.com/images/all_img/1716574609whatsapp-logo-png.png",
                "https://freepnglogo.com/images/all_img/viber-2070.png",
                "https://freepnglogo.com/images/all_img/1701508739youtube-png.png",
                "https://freepnglogo.com/images/all_img/github-mark-white-logo-b1c0.png",
              ].map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`social-${index}`}
                  className="w-12 h-12 hover:scale-110 transition-transform"
                />
              ))}
            </div>
          </div>

          {/* Right */}
          <form className="w-full max-w-xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="Enter Your Name"
              className="w-full border-b-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white placeholder-white"
            />
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full border-b-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white placeholder-white"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full border-b-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white placeholder-white"
            />
            <textarea
              placeholder="Write me a message"
              rows={6}
              className="w-full border-b-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-white placeholder-white"
            ></textarea>
            <button
              type="submit"
              className="border border-white px-6 py-2 text-white hover:bg-white hover:text-black transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
