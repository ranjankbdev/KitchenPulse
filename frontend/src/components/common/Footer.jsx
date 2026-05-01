import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="mt-6 border-t border-gray-200 bg-white">
      <div className="w-full mx-auto px-6 py-6">
        {/* Logo + Tagline */}
        <div className="flex flex-col items-center text-center gap-2">
          <img
            src="/kitchenpulse_logo.png"
            alt="KitchenPulse"
            className="w-16 h-8 object-contain"
          />

          <p className="text-sm text-gray-500">Fresh food, fast delivery — right to your door.</p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-4" />

        {/* Links + Socials */}
        <div className="flex flex-col  justify-between items-center gap-3 text-sm text-gray-500">
          <div className="flex gap-4 items-center justify-center">
            <a href="#" className="hover:text-black transition">
              About
            </a>
            <a href="#" className="hover:text-black transition">
              Contact
            </a>
            <a href="#" className="hover:text-black transition">
              Privacy
            </a>
            <a href="#" className="hover:text-black transition">
              Terms
            </a>
          </div>

          <div className="flex gap-3 text-base">
            <a
              href="https://github.com/ripuranjan-143"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/ranjan-kumar-642a061ba/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-400 mt-4 pb-5">
          © {new Date().getFullYear()} KitchenPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
