// components/PropertyEditForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const typeMap = {
  APARTMENT: "Apartment",
  CONDO: "Condo",
  HOUSE: "House",
  CABIN: "Cabin Or Cottage",
  ROOM: "Room",
  STUDIO: "Studio",
  LOFT: "Loft",
  OTHER: "Other",
  CHALET: "Chalet",
};

const amenitiesList = [
  "Wifi",
  "Full Kitchen",
  "Washer & Dryer",
  "Free Parking",
  "Swimming Pool",
  "Hot Tub",
  "24/7 Security",
  "Wheelchair Accessible",
  "Elevator Access",
  "Dishwasher",
  "Gym/Fitness Center",
  "Air Conditioning",
  "Balcony/Patio",
  "Smart TV",
  "Coffee Maker",
];

const PropertyEditForm = ({ property }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [fields, setFields] = useState({
    type: "",
    name: "",
    description: "",
    location: { street: "", city: "", state: "", zipcode: "" },
    beds: "",
    baths: "",
    square_feet: "",
    amenities: [],
    rates: { weekly: "", monthly: "", nightly: "" },
    seller_info: { name: "", email: "", phone: "" },
  });

  // ---- Hydrate form with the existing property ----
  useEffect(() => {
    if (property) {
      setFields({
        type: typeMap[property.type] || "Apartment",
        name: property.name || "",
        description: property.description || "",
        location: {
          street: property.street || "",
          city: property.city || "",
          state: property.state || "",
          zipcode: property.zipcode || "",
        },
        beds: property.beds ?? "",
        baths: property.baths ?? "",
        square_feet: property.squareFeet ?? "",
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        rates: {
          weekly: property.rates?.weekly ?? "",
          monthly: property.rates?.monthly ?? "",
          nightly: property.rates?.nightly ?? "",
        },
        seller_info: {
          name: property.sellerName || "",
          email: property.sellerEmail || "",
          phone: property.sellerPhone || "",
        },
      });
    }
    setMounted(true);
  }, [property]);

  // ---- Change handlers ----
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");
      setFields((prev) => ({
        ...prev,
        [outerKey]: { ...prev[outerKey], [innerKey]: value },
      }));
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setFields((prev) => {
      const updated = [...prev.amenities];
      if (checked) {
        if (!updated.includes(value)) updated.push(value);
      } else {
        const i = updated.indexOf(value);
        if (i !== -1) updated.splice(i, 1);
      }
      return { ...prev, amenities: updated };
    });
  };

  // ---- Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Reverse map: UI label → Prisma enum
    const reverseTypeMap = {
      Apartment: "APARTMENT",
      Condo: "CONDO",
      House: "HOUSE",
      "Cabin Or Cottage": "CABIN",
      Room: "ROOM",
      Studio: "STUDIO",
      Loft: "LOFT",
      Other: "OTHER",
      Chalet: "CHALET",
    };

    const payload = {
      type: reverseTypeMap[fields.type] || "APARTMENT",
      name: fields.name,
      description: fields.description,
      street: fields.location.street,
      city: fields.location.city,
      state: fields.location.state,
      zipcode: fields.location.zipcode,
      beds: fields.beds,
      baths: fields.baths,
      square_feet: fields.square_feet,
      amenities: fields.amenities,
      rates: {
        weekly: fields.rates.weekly || null,
        monthly: fields.rates.monthly || null,
        nightly: fields.rates.nightly || null,
      },
      seller_name: fields.seller_info.name,
      seller_email: fields.seller_info.email,
      seller_phone: fields.seller_info.phone,
      // Preserve existing images (do not overwrite from edit form)
      images: property.images || [],
    };

    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to update property");
      }

      toast.success("Property updated successfully");
      router.push(`/properties/${property.id}`);
      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-3xl text-center font-semibold mb-6">Edit Property</h2>

      {/* Type */}
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
          Property Type
        </label>
        <select
          id="type"
          name="type"
          className="border rounded w-full py-2 px-3"
          required
          value={fields.type}
          onChange={handleChange}
        >
          <option value="Apartment">Apartment</option>
          <option value="Condo">Condo</option>
          <option value="House">House</option>
          <option value="Cabin Or Cottage">Cabin or Cottage</option>
          <option value="Room">Room</option>
          <option value="Studio">Studio</option>
          <option value="Loft">Loft</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Listing Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="eg. Beautiful Apartment In Miami"
          required
          value={fields.name}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="border rounded w-full py-2 px-3"
          rows="4"
          placeholder="Add an optional description of your property"
          value={fields.description}
          onChange={handleChange}
        />
      </div>

      {/* Location */}
      <div className="mb-4 bg-blue-50 p-4">
        <label className="block text-gray-700 font-bold mb-2">Location</label>
        <input
          type="text"
          id="street"
          name="location.street"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Street"
          value={fields.location.street}
          onChange={handleChange}
        />
        <input
          type="text"
          id="city"
          name="location.city"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="City"
          required
          value={fields.location.city}
          onChange={handleChange}
        />
        <input
          type="text"
          id="state"
          name="location.state"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="State"
          required
          value={fields.location.state}
          onChange={handleChange}
        />
        <input
          type="text"
          id="zipcode"
          name="location.zipcode"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Zipcode"
          value={fields.location.zipcode}
          onChange={handleChange}
        />
      </div>

      {/* Beds / Baths / Square Feet */}
      <div className="mb-4 flex flex-wrap">
        <div className="w-full sm:w-1/3 pr-2">
          <label htmlFor="beds" className="block text-gray-700 font-bold mb-2">
            Beds
          </label>
          <input
            type="number"
            id="beds"
            name="beds"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.beds}
            onChange={handleChange}
          />
        </div>
        <div className="w-full sm:w-1/3 px-2">
          <label htmlFor="baths" className="block text-gray-700 font-bold mb-2">
            Baths
          </label>
          <input
            type="number"
            id="baths"
            name="baths"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.baths}
            onChange={handleChange}
          />
        </div>
        <div className="w-full sm:w-1/3 pl-2">
          <label htmlFor="square_feet" className="block text-gray-700 font-bold mb-2">
            Square Feet
          </label>
          <input
            type="number"
            id="square_feet"
            name="square_feet"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.square_feet}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenitiesList.map((amenity) => (
            <div key={amenity}>
              <input
                type="checkbox"
                id={`amenity_${amenity}`}
                name="amenities"
                value={amenity}
                className="mr-2"
                checked={fields.amenities.includes(amenity)}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor={`amenity_${amenity}`}>{amenity}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Rates */}
      <div className="mb-4 bg-blue-50 p-4">
        <label className="block text-gray-700 font-bold mb-2">
          Rates (Leave blank if not applicable)
        </label>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <label htmlFor="weekly_rate" className="mr-2">Weekly</label>
            <input
              type="number"
              id="weekly_rate"
              name="rates.weekly"
              className="border rounded w-full py-2 px-3"
              value={fields.rates.weekly}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="monthly_rate" className="mr-2">Monthly</label>
            <input
              type="number"
              id="monthly_rate"
              name="rates.monthly"
              className="border rounded w-full py-2 px-3"
              value={fields.rates.monthly}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="nightly_rate" className="mr-2">Nightly</label>
            <input
              type="number"
              id="nightly_rate"
              name="rates.nightly"
              className="border rounded w-full py-2 px-3"
              value={fields.rates.nightly}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Seller info */}
      <div className="mb-4">
        <label htmlFor="seller_name" className="block text-gray-700 font-bold mb-2">
          Seller Name
        </label>
        <input
          type="text"
          id="seller_name"
          name="seller_info.name"
          className="border rounded w-full py-2 px-3"
          placeholder="Name"
          value={fields.seller_info.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="seller_email" className="block text-gray-700 font-bold mb-2">
          Seller Email
        </label>
        <input
          type="email"
          id="seller_email"
          name="seller_info.email"
          className="border rounded w-full py-2 px-3"
          placeholder="Email address"
          required
          value={fields.seller_info.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="seller_phone" className="block text-gray-700 font-bold mb-2">
          Seller Phone
        </label>
        <input
          type="tel"
          id="seller_phone"
          name="seller_info.phone"
          className="border rounded w-full py-2 px-3"
          placeholder="Phone"
          value={fields.seller_info.phone}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating Property..." : "Update Property"}
        </button>
      </div>
    </form>
  );
};

export default PropertyEditForm;