import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            © 2025 CareerBoost
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/blog" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


