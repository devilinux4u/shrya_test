import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Logo from "../assets/Logo.png"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img src={Logo} alt="Shreya Auto Enterprises Logo" className="h-12 w-auto mr-2" />
              <h3 className="text-2xl font-bold">Shreya Auto Enterprises</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner in finding the perfect vehicle. Quality cars, exceptional service.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" Icon={Facebook} />
              <SocialIcon href="#" Icon={Twitter} />
              <SocialIcon href="#" Icon={Instagram} />
              <SocialIcon href="#" Icon={Linkedin} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/services">Our Services</FooterLink>
              <FooterLink href="/inventory">Vehicle Inventory</FooterLink>
              <FooterLink href="/financing">Financing Options</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <FooterLink href="/buy">Buy a Vehicle</FooterLink>
              <FooterLink href="/sell">Sell Your Car</FooterLink>
              <FooterLink href="/trade-in">Trade-In</FooterLink>
              <FooterLink href="/maintenance">Car Maintenance</FooterLink>
              <FooterLink href="/insurance">Car Insurance</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest offers and news.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-gray-400">&copy; 2024 Shreya Auto Enterprises. All rights reserved.</p>
          <div className="mt-4 sm:mt-0">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <span className="mx-2 text-gray-600">|</span>
            <FooterLink href="/terms">Terms of Service</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ href, Icon }) => (
  <a
    href={href}
    className="text-gray-400 hover:text-white transition duration-300 ease-in-out"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon size={24} />
  </a>
)

const FooterLink = ({ href, children }) => (
  <li>
    <Link to={href} className="text-gray-400 hover:text-white transition duration-300 ease-in-out">
      {children}
    </Link>
  </li>
)

export default Footer