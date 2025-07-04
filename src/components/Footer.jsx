import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} AdeStream. All rights reserved. | Powered by TMDB
            API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
