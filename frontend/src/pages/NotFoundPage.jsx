import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <h1 className="text-[120px] sm:text-[150px] font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Page Not Found
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Sorry, the page you are looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition-all"
            >
              <Home className="w-5 h-5" />
              Go Back Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Error Code: 404
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
