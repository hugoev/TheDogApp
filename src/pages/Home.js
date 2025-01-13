// src/pages/Home.js
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { Search, Loader2, Heart, MoreHorizontal, Filter, Plus } from "lucide-react"

export default function Home() {
  const [dogs, setDogs] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [noResults, setNoResults] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    fetchDogs()
    const savedFavorites = localStorage.getItem('dogFavorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    const handleScroll = () => {
      const position = window.scrollY
      setShowFloatingButton(position > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchDogs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch("https://api.thedogapi.com/v1/breeds")
      if (!res.ok) throw new Error('Failed to fetch dogs')
      const data = await res.json()
      setDogs(data)
      setNoResults(false)
    } catch (error) {
      setError("Unable to fetch dogs. Please try again later.")
      console.error("Error fetching dogs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchDogs = async () => {
    if (!searchQuery.trim()) {
      fetchDogs()
      return
    }

    try {
      setIsSearching(true)
      setError(null)
      const res = await fetch(
        `https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(searchQuery.trim())}`
      )
      if (!res.ok) throw new Error('Failed to search dogs')
      const data = await res.json()
      setDogs(data)
      setNoResults(data.length === 0)
    } catch (error) {
      setError("Search failed. Please try again.")
      console.error("Error searching dogs:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    searchDogs()
  }

  const toggleFavorite = useCallback((e, dogId) => {
    e.preventDefault()
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(dogId)
        ? prevFavorites.filter(id => id !== dogId)
        : [...prevFavorites, dogId]
      localStorage.setItem('dogFavorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center px-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
            <div className="absolute inset-0 backdrop-blur-sm rounded-full" />
          </div>
          <h2 className="mt-4 text-xl font-medium text-gray-900">Loading</h2>
          <p className="text-gray-500 mt-2">Fetching adorable dogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dogs
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ios-button">
                <Filter className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ios-button">
                <MoreHorizontal className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search dogs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/60 text-gray-900 placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/80 
                transition-all duration-200 backdrop-blur-xl border border-gray-200/50 shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5 animate-spin" />
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 mx-auto max-w-md animate-slide-up">
            <div className="p-4 rounded-2xl ios-card bg-red-50/50 border-red-100/50">
              <div className="flex items-center gap-2 text-red-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {noResults && (
          <div className="text-center py-12 animate-slide-up">
            <div className="ios-card rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-gray-600">
                No dogs found matching "{searchQuery}".{" "}
                <button
                  onClick={fetchDogs}
                  className="text-blue-500 font-medium hover:text-blue-600 ios-button"
                >
                  View all dogs
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Dog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog) => (
            <Link
              to={`/${dog.name}`}
              key={dog.id}
              className="block group animate-slide-up"
            >
              <article className="h-full ios-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative w-full pt-[66.67%] bg-gray-100">
                  {dog.reference_image_id ? (
                    <img
                      src={`https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`}
                      alt={dog.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/300'
                        e.target.alt = 'No image available'
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                      No image available
                    </div>
                  )}
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, dog.id)}
                    className="absolute top-3 right-3 p-3 rounded-full bg-white/70 backdrop-blur-xl 
                      shadow-sm hover:bg-white transition-all duration-200 ios-button
                      group-hover:scale-110"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors duration-200 ${
                        favorites.includes(dog.id)
                          ? "fill-red-500 text-red-500"
                          : "fill-none text-gray-600"
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-500 transition-colors duration-200">
                      {dog.name}
                    </h3>
                    {dog.breed_group && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                        {dog.breed_group}
                      </span>
                    )}
                  </div>

                  {dog.bred_for && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-gray-900">Bred For:</span>{" "}
                      {dog.bred_for}
                    </p>
                  )}

                  {dog.temperament && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      <span className="font-medium text-gray-700">Temperament:</span>{" "}
                      {dog.temperament}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {dog.life_span}
                    </span>
                    <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      View Details →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      {showFloatingButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-500 text-white shadow-lg 
            hover:bg-blue-600 transition-all duration-200 ios-button z-50"
        >
          <Plus className="h-6 w-6 transform rotate-45" />
        </button>
      )}
    </div>
  )
}