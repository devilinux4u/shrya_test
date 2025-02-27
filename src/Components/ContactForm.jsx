import FormImage1 from '../assets/FormImage1.png';
import FormImage2 from '../assets/FormImage2.png';
import FormImage3 from '../assets/FormImage3.png';
import FormBackground from '../assets/FormBackground.png';

export default function ContactForm() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${FormBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-7xl rounded-lg shadow-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-8 px-4">
          <h1 className="text-4xl font-bold text-white text-center lg:text-left">
            Send Us a Message
          </h1>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border border-white/30 rounded-lg p-4 text-white placeholder-white/70 focus:outline-none focus:border-white/50"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border border-white/30 rounded-lg p-4 text-white placeholder-white/70 focus:outline-none focus:border-white/50"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full bg-transparent border border-white/30 rounded-lg p-4 text-white placeholder-white/70 focus:outline-none focus:border-white/50"
            />
            <textarea
              placeholder="Message"
              rows={5}
              className="w-full bg-transparent border border-white/30 rounded-lg p-4 text-white placeholder-white/70 focus:outline-none focus:border-white/50 resize-none"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        {/* Images Section */}
        <div className="grid grid-cols-2 gap-4 px-4">
          <img
            src={FormImage1}
            alt="Mountain landscape"
            className="rounded-lg w-full h-48 object-cover"
          />
          <img
            src={FormImage2}
            alt="Car in action"
            className="rounded-lg w-full h-48 object-cover"
          />
          <img
            src={FormImage3}
            alt="Highway sunset"
            className="rounded-lg w-full h-48 object-cover col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
