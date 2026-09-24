// app/api/properties/user/[userId]/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ============================================
// GET /api/properties/user/:userId
// Fetch all properties owned by a specific user
// ============================================
export async function GET(request, { params }) {
  try {
    // 1. Authenticate
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get the user ID from the URL
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // 3. SECURITY: Users can only see their own properties (or admins can see anyone's)
    if (userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only view your own properties." },
        { status: 403 }
      );
    }

    // 4. Fetch properties owned by this user
    const properties = await prisma.property.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });

    // 5. Prisma returns JSON fields already parsed — no manual parsing needed
    return NextResponse.json(properties);
  } catch (error) {
    console.error("❌ Error fetching user properties:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user properties" },
      { status: 500 }
    );
  }
}