// components/PropertyDetails.jsx
import React from 'react'
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTimes,
  FaCheck,
  FaMapMarker
} from 'react-icons/fa'

const PropertyDetails = ({ property }) => {
  // Helper function to format rates
  const getRateDisplay = () => {
    const { rates } = property
    if (rates?.monthly) {
      return `$${rates.monthly.toLocaleString()}/mo`
    } else if (rates?.weekly) {
      return `$${rates.weekly.toLocaleString()}/wk`
    } else if (rates?.nightly) {
      return `$${rates.nightly.toLocaleString()}/night`
    }
    return 'Contact for rates'
  }

  // Get amenities array
  const amenities = Array.isArray(property.amenities) ? property.amenities : []

  return (
    <>
      {/* Main Content - 2/3 */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
          <div className="text-gray-500 mb-4">{property.type}</div>
          <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
          <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
            <FaMapMarker className="text-lg text-orange-700 mr-2" />
            <p className="text-orange-700">
              {property.street}, {property.city}, {property.state}
            </p>
          </div>

          <h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2 rounded">
            Rates & Options
          </h3>
          <div className="flex flex-col md:flex-row justify-around">
            {/* Nightly Rate */}
            <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
              <div className="text-gray-500 mr-2 font-bold">Nightly</div>
              <div className="text-2xl font-bold">
                {property.rates?.nightly ? (
                  <span className="text-blue-500">${property.rates.nightly.toLocaleString()}</span>
                ) : (
                  <FaTimes className="text-red-700" />
                )}
              </div>
            </div>

            {/* Weekly Rate */}
            <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
              <div className="text-gray-500 mr-2 font-bold">Weekly</div>
              <div className="text-2xl font-bold">
                {property.rates?.weekly ? (
                  <span className="text-blue-500">${property.rates.weekly.toLocaleString()}</span>
                ) : (
                  <FaTimes className="text-red-700" />
                )}
              </div>
            </div>

            {/* Monthly Rate */}
            <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
              <div className="text-gray-500 mr-2 font-bold">Monthly</div>
              <div className="text-2xl font-bold">
                {property.rates?.monthly ? (
                  <span className="text-blue-500">${property.rates.monthly.toLocaleString()}</span>
                ) : (
                  <FaTimes className="text-red-700" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description & Details */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-bold mb-6">Description & Details</h3>
          <div className="flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9">
            <p>
              <FaBed className="inline-block mr-2" /> {property.beds || 0}
              <span className="hidden sm:inline ml-1">Beds</span>
            </p>
            <p>
              <FaBath className="inline-block mr-2" /> {property.baths || 0}
              <span className="hidden sm:inline ml-1">Baths</span>
            </p>
            <p>
              <FaRulerCombined className="inline-block mr-2" />
              {property.square_feet || 0} <span className="hidden sm:inline">sqft</span>
            </p>
          </div>
          <p className="text-gray-500 mb-4 text-center">{property.description}</p>
        </div>

        {/* Amenities */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-bold mb-6">Amenities</h3>
          {amenities.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none">
              {amenities.map((amenity, index) => (
                <li key={index} className="flex items-center">
                  <FaCheck className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No amenities listed</p>
          )}
        </div>

        {/* Map Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div id="map" className="h-64 bg-gray-200 rounded flex items-center justify-center">
            <p className="text-gray-500">Map Location</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PropertyDetails