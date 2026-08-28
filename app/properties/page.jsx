// app/properties/page.jsx
import React from 'react'
import { prisma } from '@/lib/db'
import PropertyCard from '@/components/PropertyCard'

const PropertiesPage = async () => {
  try {
    // Get the Prisma client
    const client = await prisma
    
    // Fetch all properties with their owners
    const properties = await client.property.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return (
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center mb-8">All Properties</h1>
          
          {properties.length === 0 ? (
            <p className="text-center text-gray-500">No properties found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error fetching properties:', error)
    return (
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center mb-8">All Properties</h1>
          <p className="text-center text-red-500">Error loading properties. Please try again later.</p>
        </div>
      </section>
    )
  }
}

export default PropertiesPage