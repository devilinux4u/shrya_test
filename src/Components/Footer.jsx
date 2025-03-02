import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, PhoneCall, Mail, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Shreya Auto Enterprises</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Your trusted partner in automotive excellence. Quality vehicles, exceptional service.
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
            <h4 className="text-lg sm:text-xl font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 text-white">Our Services</h4>
            <ul className="space-y-2">
              <FooterLink href="/buy">Buy a Vehicle</FooterLink>
              <FooterLink href="/sell">Sell Your Car</FooterLink>
              <FooterLink href="/rent">Rent a Vehicle</FooterLink>
              <FooterLink href="/lost-and-found">Lost and Found</FooterLink>
              <FooterLink href="/wishlist">Wish List</FooterLink>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <PhoneCall className="mr-2 h-5 w-5 text-white flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  9841594067
                  <br />
                  01-4541713
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-white flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">shreyaauto.enterprises@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-white mt-1 flex-shrink-0" />
                <span className="text-sm sm:text-base">Bishalnagar-5, Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            &copy; 2024 Shreya Auto Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ href, Icon }) => (
  <a
    href={href}
    className="text-gray-400 hover:text-white transition duration-300 ease-in-out transform hover:scale-110"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon size={20} className="sm:w-6 sm:h-6" />
  </a>
)

const FooterLink = ({ href, children }) => (
  <li>
    <Link to={href} className="text-gray-400 hover:text-white transition duration-300 ease-in-out text-sm sm:text-base">
      {children}
    </Link>
  </li>
)

export default Footer

