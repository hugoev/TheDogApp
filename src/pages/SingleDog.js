// src/pages/SingleDog.js
import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronLeft, Heart, Share2, Info, Clock, Scale, Ruler } from "lucide-react"

export default function SingleDog() {
  const [dog, setDog] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { name } = useParams()

  useEffect(() => {
    const fetchSingleDogData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch(
          `https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(name)}`
        )
        if (!res.ok) throw new Error('Failed to fetch dog details')
        const data = await res.json()
        setDog(data)
      } catch (error) {
        setError("Unable to fetch dog details. Please try again later.")
        console.error("Error fetching dog:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSingleDogData()
  }, [name])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-xl font-medium text-gray-900">Loading...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <p className="text-red-600">{error}</p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to all dogs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* iOS-style Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gray-50/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center text-blue-500 hover:text-blue-600"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </Link>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {dog.map((item) => (
          <div key={item.id}>
            {/* Main Card */}
            <article className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              {/* Image Section */}
              <div className="relative aspect-w-16 aspect-h-9 bg-gray-100">
                {item.reference_image_id ? (
                  <img
                    src={`https://cdn2.thedogapi.com/images/${item.reference_image_id}.jpg`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/800/450'
                      e.target.alt = 'No image available'
                    }}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.name}
                    </h1>
                    {item.breed_group && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                        {item.breed_group}
                      </span>
                    )}
                  </div>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                    <Heart className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Weight */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-gray-900">Weight</h3>
                    </div>
                    <p className="text-gray-600">{item.weight?.imperial} lbs</p>
                  </div>

                  {/* Height */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-gray-900">Height</h3>
                    </div>
                    <p className="text-gray-600">{item.height?.imperial} inches</p>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-4">
                  {item.bred_for && (
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Bred For</h3>
                        <p className="text-gray-600">{item.bred_for}</p>
                      </div>
                    </div>
                  )}

                  {item.temperament && (
                    <div className="flex gap-3">
                      <Heart className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Temperament</h3>
                        <p className="text-gray-600">{item.temperament}</p>
                      </div>
                    </div>
                  )}

                  {item.life_span && (
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Life Span</h3>
                        <p className="text-gray-600">{item.life_span}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* Additional Info Card */}
            {(item.origin || item.breed_group) && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                <div className="space-y-3">
                  {item.origin && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Origin</span>
                      <span className="font-medium text-gray-900">{item.origin}</span>
                    </div>
                  )}
                  {item.breed_group && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Breed Group</span>
                      <span className="font-medium text-gray-900">{item.breed_group}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}