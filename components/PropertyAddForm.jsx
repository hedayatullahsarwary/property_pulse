// components/PropertyAddForm.jsx
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PropertyAddForm = () => {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [fields, setFields] = useState({
    type: "Apartment",
    name: "Test Property",
    description: "Test Property Description",
    location: {
      street: "",
      city: "Test City",
      state: "Test State",
      zipcode: "1002",
    },
    beds: "3",
    baths: "2",
    square_feet: "1800",
    amenities: [],
    rates: {
      weekly: "",
      monthly: "2000",
      nightly: "",
    },
    seller_info: {
      name: "Shamsuddin",
      email: "test@gmail.com",
      phone: "+93777694408",
    },
    images: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- Handler: Standard Field Changes ----
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");

      setFields((prevFields) => ({
        ...prevFields,
        [outerKey]: {
          ...prevFields[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  // ---- Handler: Amenities Checkboxes ----
  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    const updatedAmenities = [...fields.amenities];

    if (checked) {
      updatedAmenities.push(value);
    } else {
      const index = updatedAmenities.indexOf(value);
      if (index !== -1) {
        updatedAmenities.splice(index, 1);
      }
    }

    setFields((prevFields) => ({
      ...prevFields,
      amenities: updatedAmenities,
    }));
  };

  // ---- Handler: Image Upload ----
  const handleImageChange = (e) => {
    const { files } = e.target;
    const updatedImages = [...fields.images];

    for (const file of files) {
      updatedImages.push(file);
    }

    setFields((prevFields) => ({
      ...prevFields,
      images: updatedImages,
    }));
  };

  // ---- Handler: Form Submit ----
    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
        // Map UI types to Prisma enum values
        const typeMap = {
        Apartment: "APARTMENT",
        Condo: "CONDO",
        House: "HOUSE",
        "Cabin Or Cottage": "CABIN",
        Room: "ROOM",
        Studio: "STUDIO",
        Other: "OTHER",
        };

        // Create FormData (required for file uploads)
        const formData = new FormData();

        // Basic fields
        formData.append("type", typeMap[fields.type] || "APARTMENT");
        formData.append("name", fields.name);
        formData.append("description", fields.description);

        // Location fields (flattened)
        formData.append("street", fields.location.street);
        formData.append("city", fields.location.city);
        formData.append("state", fields.location.state);
        formData.append("zipcode", fields.location.zipcode);

        // Numeric fields
        formData.append("beds", fields.beds);
        formData.append("baths", fields.baths);
        formData.append("square_feet", fields.square_feet);

        // Amenities (each as separate entry)
        fields.amenities.forEach((amenity) => {
        formData.append("amenities", amenity);
        });

        // Rates
        formData.append("weekly", fields.rates.weekly || "");
        formData.append("monthly", fields.rates.monthly || "");
        formData.append("nightly", fields.rates.nightly || "");

        // Seller info
        formData.append("seller_name", fields.seller_info.name);
        formData.append("seller_email", fields.seller_info.email);
        formData.append("seller_phone", fields.seller_info.phone);

        // Images (all files)
        fields.images.forEach((image) => {
        if (image instanceof File) {
            formData.append("images", image);
        }
        });

        console.log("Submitting FormData...");

        const response = await fetch("/api/properties", {
        method: "POST",
        body: formData, // Do NOT set Content-Type — browser sets it with boundary
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.error || "Failed to add property");
        }

        console.log("✅ Success:", data);
        alert("Property added successfully!");

        // Redirect
        router.push("/properties");
        router.refresh();
    } catch (err) {
        console.error("❌ Submit error:", err);
        setError(err.message || "Something went wrong");
    } finally {
        setIsSubmitting(false);
    }
    };

  return (
    mounted && (
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl text-center font-semibold mb-6">
          Add Property
        </h2>

        {/* ---- Property Type ---- */}
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
            <option value="Other">Other</option>
          </select>
        </div>

        {/* ---- Listing Name ---- */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Listing Name
          </label>
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

        {/* ---- Description ---- */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
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
          ></textarea>
        </div>

        {/* ---- Location ---- */}
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

        {/* ---- Beds / Baths / Square Feet ---- */}
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
            <label
              htmlFor="square_feet"
              className="block text-gray-700 font-bold mb-2"
            >
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

        {/* ---- Amenities (same as before) ---- */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
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
            ].map((amenity) => (
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

        {/* ---- Rates ---- */}
        <div className="mb-4 bg-blue-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">
            Rates (Leave blank if not applicable)
          </label>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <label htmlFor="weekly_rate" className="mr-2">
                Weekly
              </label>
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
              <label htmlFor="monthly_rate" className="mr-2">
                Monthly
              </label>
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
              <label htmlFor="nightly_rate" className="mr-2">
                Nightly
              </label>
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

        {/* ---- Seller Info ---- */}
        <div className="mb-4">
          <label
            htmlFor="seller_name"
            className="block text-gray-700 font-bold mb-2"
          >
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
          <label
            htmlFor="seller_email"
            className="block text-gray-700 font-bold mb-2"
          >
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
          <label
            htmlFor="seller_phone"
            className="block text-gray-700 font-bold mb-2"
          >
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

        {/* ---- Images ---- */}
        <div className="mb-4">
          <label htmlFor="images" className="block text-gray-700 font-bold mb-2">
            Images (Select up to 4 images)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            className="border rounded w-full py-2 px-3"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        {/* ---- Error Message ---- */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* ---- Submit Button ---- */}
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Property..." : "Add Property"}
          </button>
        </div>
      </form>
    )
  );
};

export default PropertyAddForm;