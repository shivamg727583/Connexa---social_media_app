import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-gray-800 mb-4">
          404
        </h1>

        <p className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </p>

        <p className="text-gray-500 mb-6">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
    