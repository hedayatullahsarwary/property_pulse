// components/PropertyCard.jsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaBed, FaBath, FaRulerCombined, FaMoneyBill, FaMapMarker } from 'react-icons/fa'

const PropertyCard = ({ property }) => {
  const getRateDisplay = () => {
    const { rates } = property

    if (rates.monthly) {
      return `${rates.monthly.toLocaleString()}/mo`
    } else if (rates.weekly) {
      return `${rates.weekly.toLocaleString()}/wk`
    } else if (rates.nightly) {
      return `${rates.nightly.toLocaleString()}/night`
    }
    return 'Contact for rates'
  }

  // Handle both JSON and database property structures
  const images = Array.isArray(property.images) ? property.images : []
  const firstImage = images.length > 0 ? images[0] : 'placeholder.jpg'
  const location = property.location || property

  return (
    <div className="rounded-xl shadow-md relative hover:shadow-lg transition-shadow">
      <Image 
        src={`/images/properties/${firstImage}`} 
        height={0} 
        width={0} 
        sizes="100vw" 
        alt={property.name || 'Property'} 
        className="w-full h-auto rounded-t-xl" 
      />
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="text-gray-600">{property.type || 'Property'}</div>
          <h3 className="text-xl font-bold">{property.name}</h3>
        </div>
        <div className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          ${getRateDisplay()}
        </div>
        <div className="flex justify-center gap-4 text-gray-500 mb-4">
          <p>
            <FaBed className="inline mr-2" /> {property.beds || 0} <span className="md:hidden lg:inline">Beds</span>
          </p>
          <p>
            <FaBath className="inline mr-2" /> {property.baths || 0} <span className="md:hidden lg:inline">Baths</span>
          </p>
          <p>
            <FaRulerCombined className="inline mr-2" /> {property.squareFeet || property.square_feet || 0} <span className="md:hidden lg:inline">sqft</span>
          </p>
        </div>
        <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
          {property.rates?.nightly && (
            <p><FaMoneyBill className="inline mr-2" /> Nightly</p>
          )}
          {property.rates?.weekly && (
            <p><FaMoneyBill className="inline mr-2" /> Weekly</p>
          )}
          {property.rates?.monthly && (
            <p><FaMoneyBill className="inline mr-2" /> Monthly</p>
          )}
        </div>
        <div className="border border-gray-100 mb-5"></div>
        <div className="flex flex-col lg:flex-row justify-between mb-4">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <FaMapMarker className="text-orange-700 mt-1" />
            <span className="text-orange-700">
              {location.city || property.city || ''}{location.state ? `, ${location.state}` : ''}
            </span>
          </div>
          <Link 
            href={`/properties/${property.id}`} 
            className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard