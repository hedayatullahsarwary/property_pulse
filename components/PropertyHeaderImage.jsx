// components/PropertyHeaderImage.jsx
import React from 'react'
import Image from 'next/image'

const PropertyHeaderImage = ({ image, name }) => {
  // Return a placeholder if no image
  if (!image) {
    return (
      <section>
        <div className="container-xl m-auto">
          <div className="grid grid-cols-1">
            <div className="h-[400px] w-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-xl">No Image Available</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Normalize image: handle array or single string
  const imageFile = Array.isArray(image) ? image[0] : image

  return (
    <section>
      <div className="container-xl m-auto">
        <div className="grid grid-cols-1">
          <Image
            src={`/images/properties/${imageFile}`}
            alt={name || 'Property'}
            className="object-cover h-[400px] w-full"
            width={0}
            height={0}
            sizes="100vw"
            priority={true}
          />
        </div>
      </div>
    </section>
  )
}

export default PropertyHeaderImage