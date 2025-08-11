"use client";

import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="underline text-primary">Return to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
