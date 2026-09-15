// app/profile/page.jsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import profileDefault from "@/assets/images/profile.png";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  // Fetch full user details from the database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      properties: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      savedProperties: {
        include: { property: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // ✅ Use user.image if exists, otherwise use default profile image
  const profileImage = user.image || profileDefault;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        {/* Header with Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={profileImage}
              alt={user.name || "User Profile"}
              fill
              className="rounded-full object-cover border-4 border-blue-500"
              unoptimized // Required for external URLs like ui-avatars.com
            />
          </div>

          <h1 className="text-3xl font-bold">{user.name || "User"}</h1>

          <span className="mt-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold">
            {user.role}
          </span>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="font-semibold break-all">{user.email}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Phone</p>
            <p className="font-semibold">{user.phone || "Not provided"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="font-semibold">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <p className="font-semibold">{user.role}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600">
              {user.properties.length}
            </p>
            <p className="text-gray-600 mt-1">Properties Owned</p>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg text-center">
            <p className="text-3xl font-bold text-orange-600">
              {user.savedProperties.length}
            </p>
            <p className="text-gray-600 mt-1">Saved Properties</p>
          </div>
        </div>

        {/* Properties Owned List */}
        {user.properties.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Your Properties</h2>
            <div className="space-y-3">
              {user.properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{property.name}</p>
                      <p className="text-sm text-gray-500">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <span className="text-blue-500 text-sm">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Saved Properties List */}
        {user.savedProperties.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Saved Properties</h2>
            <div className="space-y-3">
              {user.savedProperties.map((saved) => (
                <Link
                  key={saved.id}
                  href={`/properties/${saved.property.id}`}
                  className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{saved.property.name}</p>
                      <p className="text-sm text-gray-500">
                        {saved.property.city}, {saved.property.state}
                      </p>
                    </div>
                    <span className="text-blue-500 text-sm">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}