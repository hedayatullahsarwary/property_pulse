// app/api/properties/[id]/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

// ============================================
// DELETE /api/properties/:id
// Delete a property (owner or admin only)
// ============================================
export async function DELETE(request, { params }) {
  try {
    // 1. Authenticate
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get the property ID from the URL
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required." },
        { status: 400 }
      );
    }

    // 3. Find the property
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found." },
        { status: 404 }
      );
    }

    // 4. Verify ownership (or admin)
    const isOwner = property.ownerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "You do not have permission to delete this property." },
        { status: 403 }
      );
    }

    // 5. Delete associated image files from disk
    const images = Array.isArray(property.images) ? property.images : [];
    for (const imageName of images) {
      try {
        const imagePath = path.join(
          process.cwd(),
          "public",
          "images",
          "properties",
          imageName
        );
        await unlink(imagePath);
        console.log(`🗑️  Deleted image: ${imageName}`);
      } catch (err) {
        console.warn(`⚠️  Could not delete ${imageName}: ${err.message}`);
      }
    }

    // 6. Delete the property (cascade removes savedProperty + message rows)
    await prisma.property.delete({ where: { id } });

    console.log(`✅ Property deleted: ${property.name} (${id})`);

    return NextResponse.json(
      { message: "Property deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting property:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete property." },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/properties/:id
// Fetch a single property
// ============================================
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property." },
      { status: 500 }
    );
  }
}