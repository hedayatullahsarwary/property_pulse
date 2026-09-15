// app/profile/page.jsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold">{user.name || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold">{user.phone || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {user.role}
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Properties Owned</p>
            <p className="font-semibold">{user.properties.length}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Saved Properties</p>
            <p className="font-semibold">{user.savedProperties.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}