import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black text-blue-600 mb-4">404</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Home size={16} /> Home
        </Link>
      </div>
    </div>
  );
}
