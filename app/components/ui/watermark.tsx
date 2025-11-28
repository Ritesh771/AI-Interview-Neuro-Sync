"use client";

import Link from "next/link";

const Watermark = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link 
        href="https://riteshn.me/" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 underline"
      >
        Developed by Ritesh N
      </Link>
    </div>
  );
};

export default Watermark;