import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TEXT } from "@/constants/text";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{TEXT.notFound.title}</h1>
        <p className="mb-4 text-xl text-gray-600">{TEXT.notFound.subtitle}</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          {TEXT.notFound.link}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
