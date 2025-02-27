import React from 'react';
import Logo from '../assets/Logo.png';
import Facebook from '../assets/Facebook.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 w-full">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 lg:px-20 flex flex-wrap justify-between items-start gap-10">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Elite Drives Logo" className="w-40 h-auto" />
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-4">
            <a href="/pricing" className="hover:text-indigo-500 transition-colors">Pricing</a>
            <a href="/features" className="hover:text-indigo-500 transition-colors">Features</a>
            <a href="/help-center" className="hover:text-indigo-500 transition-colors">Help Center</a>
            <a href="/contact" className="hover:text-indigo-500 transition-colors">Contact</a>
          </div>
          <div className="flex flex-col gap-4">
            <a href="/services" className="hover:text-indigo-500 transition-colors">Services</a>
            <a href="/companies" className="hover:text-indigo-500 transition-colors">Companies</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full border-t border-white/10 mt-10 pt-6">
        <div className="container mx-auto px-6 lg:px-20 flex flex-wrap justify-between items-center gap-6">
          <p className="text-sm text-white/60">© Copyright 2024 - Shreya Auto Enterprises</p>
          <div className="flex gap-4">
            <a href="https://twitter.com" className="hover:opacity-80 transition-opacity">
              <img src="/twitter.svg" alt="Twitter" className="w-6 h-6" />
            </a>
            <a href="https://www.facebook.com/p/Shreya-Auto-Enterprises-100057713250606/" className="hover:opacity-80 transition-opacity">
              <img src={Facebook} alt="Facebook" className="w-20 h-15" />
            </a>
            <a href="https://instagram.com" className="hover:opacity-80 transition-opacity">
              <img src="/instagram.svg" alt="Instagram" className="w-6 h-6" />
            </a>
            <a href="https://whatsapp.com" className="hover:opacity-80 transition-opacity">
              <img src="/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
