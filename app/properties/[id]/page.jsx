// app/properties/[id]/page.jsx
import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import PropertyDetails from '@/components/PropertyDetails'
import Spinner from '@/components/Spinner'
import { FaArrowLeft } from 'react-icons/fa'

// Create a separate component for the property content
async function PropertyContent({ id }) {
  const property = await prisma.$queryRaw`
    SELECT 
      p.*,
      u.name as ownerName,
      u.email as ownerEmail,
      u.phone as ownerPhone
    FROM Property p
    LEFT JOIN User u ON p.ownerId = u.id
    WHERE p.id = ${id}
    LIMIT 1
  `
  
  if (!property || property.length === 0) {
    notFound()
  }

  const propertyData = property[0]
  const images = Array.isArray(propertyData.images) ? propertyData.images : []

  return (
    <>
      <PropertyHeaderImage 
        image={images.length > 0 ? images[0] : null} 
        name={propertyData.name} 
      />

      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Properties
          </Link>
        </div>
      </section>

      <section className="bg-blue-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PropertyDetails property={propertyData} />
            </div>

            <aside className="lg:col-span-1 space-y-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center transition-colors">
                <i className="fas fa-bookmark mr-2"></i> Bookmark Property
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center transition-colors">
                <i className="fas fa-share mr-2"></i> Share Property
              </button>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">Contact Property Manager</h3>
                <form>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                      Name:
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='name'
                      type='text'
                      placeholder='Enter your name'             
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email:
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>
                      Phone:
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='phone'
                      type='text'
                      placeholder='Enter your phone number'
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                      Message:
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
                      id="message"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center transition-colors"
                      type="submit"
                    >
                      <i className="fas fa-paper-plane mr-2"></i> Send Message
                    </button>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

// Main page component with Suspense
const PropertyPage = async ({ params }) => {
  const { id } = await params

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Spinner loading={true} />
      </div>
    }>
      <PropertyContent id={id} />
    </Suspense>
  )
}

export default PropertyPage