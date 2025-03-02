import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-6 text-left flex justify-between items-center focus:outline-none"
        onClick={onClick}
      >
        <span className="font-semibold text-lg">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[#ff6b00]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#ff6b00]" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqData = {
    general: [
      {
        id: 'g1',
        question: 'What are your business hours?',
        answer: 'We are open Monday through Friday from 9:00 AM to 6:00 PM, and Saturday from 9:00 AM to 3:00 PM. We are closed on Sundays and public holidays.',
      },
      {
        id: 'g2',
        question: 'Where are you located?',
        answer: 'We are located at Pragati Marga, Kathmandu, Nepal. You can easily find us using Google Maps or contact us for directions.',
      },
      {
        id: 'g3',
        question: 'Do you offer test drives?',
        answer: 'Yes, we offer test drives for all our vehicles. You can schedule a test drive through our upcoming online platform or by visiting our showroom.',
      },
    ],
    services: [
      {
        id: 's1',
        question: 'What types of vehicles do you offer?',
        answer: 'We offer a wide range of vehicles including sedans, SUVs, luxury cars, and commercial vehicles. Our inventory includes both new and pre-owned vehicles from various renowned manufacturers.',
      },
      {
        id: 's2',
        question: 'Do you provide vehicle maintenance services?',
        answer: 'Yes, we provide comprehensive vehicle maintenance services including regular servicing, repairs, and periodic maintenance checks. Our team of certified technicians ensures your vehicle receives the best care.',
      },
      {
        id: 's3',
        question: 'What are your rental options?',
        answer: 'We offer flexible rental options including daily, weekly, and monthly rentals. Our upcoming online platform will make it even easier to browse and book rental vehicles.',
      },
    ],
    payment: [
      {
        id: 'p1',
        question: 'What payment methods do you accept?',
        answer: 'We accept cash, bank transfers, and all major credit/debit cards. For vehicle purchases, we also offer financing options through our partner banks.',
      },
      {
        id: 'p2',
        question: 'Do you offer financing options?',
        answer: 'Yes, we offer various financing options through our partner banks. Our team can help you find the best financing solution that suits your needs and budget.',
      },
      {
        id: 'p3',
        question: 'Is there a booking deposit required?',
        answer: 'Yes, a booking deposit is required to reserve a vehicle. The amount varies depending on the vehicle and type of service. The deposit is fully refundable according to our cancellation policy.',
      },
    ],
    online: [
      {
        id: 'o1',
        question: 'How does your online booking system work?',
        answer: "Our upcoming online platform will allow you to browse vehicles, check availability, make reservations, and manage your bookings. You'll be able to create a wishlist and schedule test drives directly through the platform.",
      },
      {
        id: 'o2',
        question: 'Is my online payment secure?',
        answer: 'Yes, all online payments are processed through secure payment gateways. We use industry-standard encryption to protect your payment information.',
      },
      {
        id: 'o3',
        question: 'Can I modify or cancel my online booking?',
        answer: 'Yes, you can modify or cancel your booking through our platform or by contacting our customer service team, subject to our cancellation policy.',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-12 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Frequently Asked <span className="text-[#ff6b00]">Questions</span>
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our services and operations.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {/* General Questions */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">General Questions</h2>
            <div className="space-y-2">
              {faqData.general.map((item) => (
                <FAQItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openItems[item.id]}
                  onClick={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Our Services</h2>
            <div className="space-y-2">
              {faqData.services.map((item) => (
                <FAQItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openItems[item.id]}
                  onClick={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Payment & Financing */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Payment & Financing</h2>
            <div className="space-y-2">
              {faqData.payment.map((item) => (
                <FAQItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openItems[item.id]}
                  onClick={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Online Platform */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Online Platform</h2>
            <div className="space-y-2">
              {faqData.online.map((item) => (
                <FAQItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openItems[item.id]}
                  onClick={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#ff6b00] hover:bg-[#ff8533] transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;