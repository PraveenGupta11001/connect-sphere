import FAQs from "../common/FAQs";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 mt-12">
      <div>
        <FAQs />
      </div>
      <div className="max-w-8xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        {/* Logo & Brand */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-xl font-semibold text-indigo-600">WeConnect</h2>
          <p className="text-sm text-gray-500 mt-1">Connecting people, one message at a time.</p>
        </div>

        {/* Links */}
        <div className="flex space-x-6 text-sm">
          <a href="https://github.com/PraveenGupta11001" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition">
            GitHub
          </a>
          <a href="/privacy" className="hover:text-indigo-600 transition">
            Privacy
          </a>
          <a href="/terms" className="hover:text-indigo-600 transition">
            Terms
          </a>
          <a href="/contact" className="hover:text-indigo-600 transition">
            Contact
          </a>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-200">
        &copy; {new Date().getFullYear()} WeConnect. All rights reserved.
      </div>
    </footer>
  );
}
