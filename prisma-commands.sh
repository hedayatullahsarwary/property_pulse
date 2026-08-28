#!/bin/bash

set -e

echo "🚀 Starting PropertyPulse setup..."

# Start Docker containers
echo ""
echo "📦 Starting Docker containers..."
docker compose up -d

# Wait for MySQL to become ready
echo ""
echo "⏳ Waiting for MySQL to be ready..."

until docker compose exec -T mysql mysqladmin ping -h localhost -u root -proot --silent; do
    echo "   MySQL is not ready yet. Waiting..."
    sleep 2
done

echo "✅ MySQL is ready!"

# Push Prisma schema
echo ""
echo "📊 Creating database tables..."
docker compose exec -T property-pulse npx prisma db push --force-reset

echo "✅ Database tables created!"

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
docker compose exec -T property-pulse npx prisma generate

echo "✅ Prisma Client generated!"

# Seed the database
echo ""
echo "🌱 Seeding database..."
docker compose exec -T property-pulse node prisma/seed.js

echo "✅ Database seeded!"

# Verify database
echo ""
echo "🔍 Verifying database..."

echo ""
echo "📋 Tables:"
docker compose exec -T mysql mysql -u root -proot -e \
"USE \`property-pulse\`; SHOW TABLES;"

echo ""
echo "👤 Users:"
docker compose exec -T mysql mysql -u root -proot -e \
"USE \`property-pulse\`; SELECT COUNT(*) AS Users FROM User;"

echo ""
echo "🏠 Properties:"
docker compose exec -T mysql mysql -u root -proot -e \
"USE \`property-pulse\`; SELECT COUNT(*) AS Properties FROM Property;"

echo ""
echo "💬 Messages:"
docker compose exec -T mysql mysql -u root -proot -e \
"USE \`property-pulse\`; SELECT COUNT(*) AS Messages FROM Message;"

echo ""
echo "🎉 ========================================"
echo "🎉 PropertyPulse setup completed successfully!"
echo "🎉 ========================================"

echo ""
echo "📱 App: http://localhost:3000"
echo "🛢️ phpMyAdmin: http://localhost:8081"
echo "🔑 Test login:"
echo "   Tenant:   tenant@example.com / password123"
echo "   Landlord: john.doe@example.com / password123"
echo "   Admin:    admin@example.com / password123"