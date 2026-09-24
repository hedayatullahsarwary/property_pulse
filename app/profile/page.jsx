// app/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { confirmToast } from "@/components/ConfirmToast";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  const profileImage = session?.user?.image || profileDefault;
  const profileName = session?.user?.name || "User";
  const profileEmail = session?.user?.email || "";
  const profileRole = session?.user?.role || "TENANT";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // ---- Fetch user's properties ----
  useEffect(() => {
    const fetchUserProperties = async (userId) => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/properties/user/${userId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch user properties");
        }

        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching user properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.id) {
      fetchUserProperties(session.user.id);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  // ---- Actual delete logic (only called after user confirms) ----
  const deleteProperty = async (propertyId) => {
    if (isDeleting) return;
    setIsDeleting(true);

    const toastId = toast.loading("Deleting property...");

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProperties((prev) =>
          prev.filter((property) => property.id !== propertyId)
        );
        toast.update(toastId, {
          render: "Property deleted successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        const data = await res.json().catch(() => ({}));
        toast.update(toastId, {
          render: data.error || "Failed to delete property",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.update(toastId, {
        render: "Failed to delete property",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // ---- Confirm handler — only shows the toast ----
  const handleDeleteProperty = (propertyId) => {
    confirmToast(
      "Are you sure you want to delete this property?",
      () => deleteProperty(propertyId),
      () => toast.info("Delete cancelled")
    );
  };

  // ---- Loading state ----
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <section className="bg-blue-50">
        <div className="container m-auto py-24">
          <div className="flex justify-center">
            <Spinner loading={true} />
          </div>
        </div>
      </section>
    );
  }

  // ---- Not logged in ----
  if (status === "unauthenticated") {
    return (
      <section className="bg-blue-50">
        <div className="container m-auto py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <Link
            href="/login?callbackUrl=/profile"
            className="text-blue-500 hover:underline"
          >
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

          <div className="flex flex-col md:flex-row">
            {/* ===================== Profile Information ===================== */}
            <div className="md:w-1/4 mx-20 mt-10">
              <div className="mb-4">
                <Image
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0 object-cover"
                  src={profileImage}
                  alt={profileName}
                  width={192}
                  height={192}
                  unoptimized
                />
              </div>

              <h2 className="text-2xl mb-4">
                <span className="font-bold block">Name:</span>
                {profileName}
              </h2>

              <h2 className="text-2xl mb-4">
                <span className="font-bold block">Email:</span>
                {profileEmail}
              </h2>

              <h2 className="text-2xl">
                <span className="font-bold block">Role:</span>
                <span className="inline-block mt-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {profileRole}
                </span>
              </h2>
            </div>

            {/* ===================== User Listings ===================== */}
            <div className="md:w-3/4 md:pl-4">
              <h2 className="text-xl font-semibold mb-4">Your Listings</h2>

              {/* No Properties */}
              {properties.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg mb-4">
                    You have no property listings
                  </p>
                  <Link
                    href="/properties/add"
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    Add Your First Property
                  </Link>
                </div>
              ) : (
                properties.map((property) => {
                  // Safely handle the images field (array or JSON string)
                  let firstImage = "placeholder.jpg";
                  if (Array.isArray(property.images)) {
                    firstImage = property.images[0] || "placeholder.jpg";
                  } else if (typeof property.images === "string") {
                    try {
                      const parsed = JSON.parse(property.images);
                      firstImage = Array.isArray(parsed)
                        ? parsed[0] || "placeholder.jpg"
                        : "placeholder.jpg";
                    } catch {
                      firstImage = "placeholder.jpg";
                    }
                  }

                  return (
                    <div key={property.id} className="mb-10">
                      <Link href={`/properties/${property.id}`}>
                        <Image
                          className="h-32 w-full rounded-md object-cover"
                          src={`/images/properties/${firstImage}`}
                          alt={property.name}
                          width={500}
                          height={100}
                          priority={true}
                        />
                      </Link>

                      <div className="mt-2">
                        <p className="text-lg font-semibold">{property.name}</p>
                        <p className="text-gray-600">
                          Address: {property.street} {property.city}{" "}
                          {property.state}
                        </p>
                      </div>

                      <div className="mt-2">
                        <Link
                          href={`/properties/edit/${property.id}`}
                          className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600 inline-block"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
                          type="button"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;