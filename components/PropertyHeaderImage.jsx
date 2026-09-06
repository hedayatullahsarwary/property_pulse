// components/PropertyHeaderImage.jsx
import React from 'react'
import Image from 'next/image'

const PropertyHeaderImage = ({ image, name }) => {
  if (!image) {
    return (
      <div className="h-[400px] w-full bg-gray-300 flex items-center justify-center">
        <span className="text-gray-500 text-xl">No Image Available</span>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] w-full">
      <Image
        src={`/images/properties/${image}`}
        alt={name || 'Property'}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
    </div>
  )
}

export default PropertyHeaderImage