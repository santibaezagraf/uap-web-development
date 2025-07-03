import { Link } from "@tanstack/react-router"

export function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/boards/$boardId"
                params={{ boardId: '1' }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
                Go back to Home
            </Link>
        </div>
    )
}
