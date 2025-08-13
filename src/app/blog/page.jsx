export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">Career Insights &</span>
              <br />
              <span className="text-blue-600">Tips</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest career advice, industry trends, and professional development insights.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Blog Post */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How to Ace Your Next Job Interview
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn the essential tips and strategies to make a great impression in your next job interview.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">5 min read</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Blog Post */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Building a Strong Professional Network
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover effective networking strategies to advance your career and open new opportunities.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">7 min read</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Blog Post */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Remote Work Best Practices
                </h3>
                <p className="text-gray-600 mb-4">
                  Master the art of remote work with these proven productivity and communication strategies.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">6 min read</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

