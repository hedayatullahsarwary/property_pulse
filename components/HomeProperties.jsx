// components/HomeProperties.jsx

import React from "react";
import prisma from "@/lib/db";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

const HomeProperties = async () => {
  try {
    const properties = await prisma.$queryRaw`
      SELECT *
      FROM Property
      ORDER BY RAND()
      LIMIT 3
    `;

    return (
      <>
        <section className="px-4 py-6">
          <div className="container-xl lg:container m-auto">
            <h2 className="mb-6 text-center text-3xl font-bold text-blue-500">
              Recent Properties
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {properties.length === 0 ? (
                <p className="col-span-3 text-center text-gray-500">
                  No Properties Found
                </p>
              ) : (
                properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="m-auto my-10 max-w-lg px-6">
          <Link
            href="/properties"
            className="block rounded-xl bg-black px-6 py-4 text-center text-white transition-colors hover:bg-gray-700"
          >
            View All Properties
          </Link>
        </section>
      </>
    );
  } catch (error) {
    console.error("Error fetching properties:", error);

    return (
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="mb-6 text-center text-3xl font-bold text-blue-500">
            Recent Properties
          </h2>

          <p className="text-center text-red-500">
            Error loading properties. Please try again later.
          </p>
        </div>
      </section>
    );
  }
};

export default HomeProperties;