export default function ContactForm() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-2xl rounded-lg shadow-lg p-8 bg-white">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Send Us a Message</h1>
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <textarea
            placeholder="Message"
            rows={5}
            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
          />
          <button
            type="submit"
            className="w-full bg-[#ff6b00] hover:bg-[#ff8533] text-white py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}