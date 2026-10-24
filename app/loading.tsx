
export default function loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p className="ml-3 text-gray-600">Loading Dashboard...</p>
    </div>
  )
}