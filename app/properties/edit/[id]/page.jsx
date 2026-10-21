// app/properties/edit/[id]/page.jsx
import React from 'react'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import PropertyEditForm from '@/components/PropertyEditForm'

const PropertyEditPage = async ({ params }) => {
  const { id } = await params

  // Fetch property server-side to prefill the form
  const property = await prisma.property.findUnique({
    where: { id },
  })

  if (!property) {
    notFound()
  }

  // Parse JSON fields (Prisma returns them already parsed here)
  // No need to JSON.parse — Prisma Client handles JSON columns automatically
  const propertyData = {
    ...property,
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    rates: typeof property.rates === 'object' ? property.rates : {},
    images: Array.isArray(property.images) ? property.images : [],
  }

  return (
    <section className="bg-blue-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <PropertyEditForm property={propertyData} />
        </div>
      </div>
    </section>
  )
}

export default PropertyEditPage