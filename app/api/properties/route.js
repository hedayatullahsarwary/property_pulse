// app/api/properties/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    // 1. Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Parse FormData (required for file uploads)
    const formData = await request.formData();

    // 3. Extract simple fields
    const type = formData.get("type");
    const name = formData.get("name");
    const description = formData.get("description");
    const street = formData.get("street") || "";
    const city = formData.get("city") || "";
    const state = formData.get("state") || "";
    const zipcode = formData.get("zipcode") || "";
    const beds = formData.get("beds");
    const baths = formData.get("baths");
    const square_feet = formData.get("square_feet");
    const weekly = formData.get("weekly");
    const monthly = formData.get("monthly");
    const nightly = formData.get("nightly");
    const seller_name = formData.get("seller_name");
    const seller_email = formData.get("seller_email");
    const seller_phone = formData.get("seller_phone");

    // 4. Extract amenities as an array
    const amenities = formData.getAll("amenities");
    console.log("📋 Amenities received:", amenities);

    // 5. Handle image uploads
    const images = formData.getAll("images");
    const savedImageNames = [];

    if (images.length > 0) {
      // Ensure upload directory exists
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "images",
        "properties"
      );
      await mkdir(uploadDir, { recursive: true });

      for (const image of images) {
        // Skip invalid or empty files
        if (!(image instanceof File) || image.size === 0) continue;

        // Generate a unique filename to prevent collisions
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const ext = path.extname(image.name) || ".jpg";
        const baseName = path
          .basename(image.name, ext)
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9-_]/g, ""); // sanitize filename
        const filename = `${baseName}-${timestamp}-${randomStr}${ext}`;

        // Convert File to Buffer and write to disk
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        savedImageNames.push(filename);

        console.log(`✅ Saved image: ${filename} (${image.size} bytes)`);
      }
    }

    console.log("🖼️ Total images saved:", savedImageNames.length);

    // 6. Validate required fields
    if (!name || !type || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, description" },
        { status: 400 }
      );
    }

    // 7. Prepare the property data
    const propertyData = {
      ownerId: session.user.id,
      name: name,
      type: type, // Already mapped to enum on the client
      description: description,
      street: street,
      city: city,
      state: state,
      zipcode: zipcode,
      beds: parseInt(beds) || 0,
      baths: parseInt(baths) || 0,
      squareFeet: parseInt(square_feet) || 0,

      // ✅ Amenities: plain array → stored as JSON in MySQL
      amenities: amenities,

      // ✅ Rates: object → stored as JSON in MySQL
      rates: {
        weekly: weekly ? parseInt(weekly) : null,
        monthly: monthly ? parseInt(monthly) : null,
        nightly: nightly ? parseInt(nightly) : null,
      },

      sellerName: seller_name || session.user.name,
      sellerEmail: seller_email || session.user.email,
      sellerPhone: seller_phone || "",

      // ✅ Images: array of filenames → stored as JSON in MySQL
      images: savedImageNames,

      isFeatured: false,
    };

    console.log("📦 Property data to save:", {
      ...propertyData,
      images: savedImageNames,
      amenities: amenities,
    });

    // 8. Create the property in the database
    const property = await prisma.property.create({
      data: propertyData,
    });

    console.log("✅ Property created:", property.id, property.name);

    return NextResponse.json(
      {
        message: "Property added successfully",
        property: {
          id: property.id,
          name: property.name,
          images: property.images,
          amenities: property.amenities,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating property:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add property" },
      { status: 500 }
    );
  }
}

// GET all properties
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}