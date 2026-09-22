// components/PropertyImages.jsx
import React from 'react'
import Image from 'next/image'

const PropertyImages = ({ images }) => {
  // Return null early if there are no images to display
  if (!images || images.length === 0) return null

  // Normalize: handle both array and JSON-string formats
  const imageList = Array.isArray(images)
    ? images
    : typeof images === 'string'
    ? JSON.parse(images)
    : []

  if (imageList.length === 0) return null

  return (
    <section className="bg-blue-50 p-4">
      <div className="container mx-auto">
        {imageList.length === 1 ? (
          // Single image layout
          <Image
            src={`/images/properties/${imageList[0]}`}
            alt="Property view"
            className="object-cover h-[400px] mx-auto rounded-xl"
            width={1800}
            height={400}
            priority={true}
          />
        ) : (
          // Grid layout for multiple images
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imageList.map((img, index) => (
              <div
                key={index}
                className={`relative h-[400px] ${
                    imageList.length === 3 && index === 2 ? 'col-span-2' : 'col-span-1'
                }`}
                >
                <Image
                  src={`/images/properties/${img}`}
                  alt={`Property view ${index + 1}`}
                  className="object-cover rounded-xl"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PropertyImages