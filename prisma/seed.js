require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
const bcrypt = require('bcrypt')

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
})

const prisma = new PrismaClient({ adapter })

// Property type mapping from JSON to Prisma enum
const propertyTypeMap = {
  'Apartment': 'APARTMENT',
  'Studio': 'STUDIO',
  'Condo': 'CONDO',
  'House': 'HOUSE',
  'Cottage Or Cabin': 'CABIN',
  'Loft': 'LOFT',
  'Room': 'ROOM',
  'Other': 'OTHER',
  'Chalet': 'CHALET'
}

// Sample users to associate with properties
const sampleUsers = [
  { id: '1', email: 'john.doe@example.com', name: 'John Doe', phone: '617-555-5555', role: 'LANDLORD' },
  { id: '2', email: 'jane.smith@example.com', name: 'Jane Smith', phone: '212-555-5555', role: 'LANDLORD' },
  { id: '3', email: 'michael.brown@example.com', name: 'Michael Brown', phone: '312-555-5555', role: 'LANDLORD' },
  { id: '4', email: 'emily.davis@example.com', name: 'Emily Davis', phone: '512-555-5555', role: 'LANDLORD' },
  { id: '5', email: 'sarah.wilson@example.com', name: 'Sarah Wilson', phone: '305-555-5555', role: 'LANDLORD' },
  { id: '6', email: 'robert.anderson@example.com', name: 'Robert Anderson', phone: '303-555-5555', role: 'LANDLORD' },
  { id: '7', email: 'jennifer.martin@example.com', name: 'Jennifer Martin', phone: '970-555-5555', role: 'LANDLORD' },
  { id: '8', email: 'lisa.taylor@example.com', name: 'Lisa Taylor', phone: '303-555-5555', role: 'LANDLORD' },
  { id: '9', email: 'matthew.harris@example.com', name: 'Matthew Harris', phone: '215-555-5555', role: 'LANDLORD' },
  { id: '10', email: 'david.johnson@example.com', name: 'David Johnson', phone: '213-555-5555', role: 'LANDLORD' },
  { id: 'tenant-1', email: 'tenant@example.com', name: 'Test Tenant', phone: '555-555-5555', role: 'TENANT' },
  { id: 'admin-1', email: 'admin@example.com', name: 'Admin User', phone: '555-000-0000', role: 'ADMIN' }
]

// Your properties data (all 10 properties)
const propertiesData = [
  {
    "owner": "1",
    "name": "Boston Commons Retreat",
    "type": "Apartment",
    "description": "This is a beautiful apartment located near the commons. It is a 2 bedroom apartment with a full kitchen and bathroom. It is available for weekly or monthly rentals.",
    "location": { "street": "120 Tremont Street", "city": "Boston", "state": "MA", "zipcode": "02108" },
    "beds": 2,
    "baths": 1,
    "square_feet": 1500,
    "amenities": ["Wifi", "Full kitchen", "Washer & Dryer", "Free Parking", "Hot Tub", "24/7 Security", "Wheelchair Accessible", "Elevator Access", "Dishwasher", "Gym/Fitness Center", "Air Conditioning", "Balcony/Patio", "Smart TV", "Coffee Maker"],
    "rates": { "weekly": 1100, "monthly": 4200 },
    "seller_info": { "name": "John Doe", "email": "john@gmail.com", "phone": "617-555-5555" },
    "images": ["a1.jpg", "a2.jpg", "a3.jpg"],
    "is_featured": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "owner": "1",
    "name": "Cozy Downtown Loft",
    "type": "Apartment",
    "description": "A cozy downtown loft with great city views.",
    "location": { "street": "45 Main Street", "city": "New York", "state": "NY", "zipcode": "10001" },
    "beds": 1,
    "baths": 1,
    "square_feet": 1800,
    "amenities": ["Wifi", "Full kitchen", "Washer & Dryer", "Free Parking", "Hot Tub", "24/7 Security", "Wheelchair Accessible", "Elevator Access", "Dishwasher", "High-Speed Internet", "Air Conditioning", "Smart TV", "Outdoor Grill/BBQ"],
    "rates": { "weekly": 1000, "monthly": 4000 },
    "seller_info": { "name": "Jane Smith", "email": "jane@gmail.com", "phone": "212-555-5555" },
    "images": ["b1.jpg", "b2.jpg", "b3.jpg"],
    "is_featured": false,
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  {
    "owner": "2",
    "name": "Luxury Condo with a View",
    "type": "Condo",
    "description": "Experience luxury in this stunning condo with breathtaking views.",
    "location": { "street": "500 Lux Lane", "city": "Los Angeles", "state": "CA", "zipcode": "90001" },
    "beds": 3,
    "baths": 2,
    "square_feet": 2200,
    "amenities": ["Wifi", "Full kitchen", "Washer & Dryer", "Free Parking", "Hot Tub", "24/7 Security", "Wheelchair Accessible", "Elevator Access", "Dishwasher", "Swimming Pool", "Gym/Fitness Center", "Air Conditioning", "Smart TV", "Coffee Maker"],
    "rates": { "nightly": 200, "weekly": 750, "monthly": 3300 },
    "seller_info": { "name": "David Johnson", "email": "david@gmail.com", "phone": "213-555-5555" },
    "images": ["c1.jpg", "c2.jpg", "c3.jpg"],
    "is_featured": false,
    "createdAt": "2024-01-03T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  },
  {
    "owner": "2",
    "name": "Charming Cottage Getaway",
    "type": "Cottage Or Cabin",
    "description": "Escape to this charming cottage for a peaceful retreat.",
    "location": { "street": "123 Countryside Lane", "city": "Austin", "state": "TX", "zipcode": "78701" },
    "beds": 1,
    "baths": 1,
    "square_feet": 900,
    "amenities": ["Fireplace", "Outdoor Grill/BBQ", "Balcony/Patio", "Coffee Maker"],
    "rates": { "weekly": 2000 },
    "seller_info": { "name": "Emily Davis", "email": "emily@gmail.com", "phone": "512-555-5555" },
    "images": ["d1.jpg", "d2.jpg", "d3.jpg"],
    "is_featured": false,
    "createdAt": "2024-01-04T00:00:00.000Z",
    "updatedAt": "2024-01-04T00:00:00.000Z"
  },
  {
    "owner": "3",
    "name": "Modern Downtown Studio",
    "type": "Studio",
    "description": "Stay in style in this modern downtown studio apartment.",
    "location": { "street": "75 Urban Avenue", "city": "Chicago", "state": "IL", "zipcode": "60601" },
    "beds": 1,
    "baths": 1,
    "square_feet": 900,
    "amenities": ["High-Speed Internet", "Smart TV", "Air Conditioning", "Gym/Fitness Center", "Outdoor Grill/BBQ"],
    "rates": { "weekly": 1100, "monthly": 4200 },
    "seller_info": { "name": "Michael Brown", "email": "michael@gmail.com", "phone": "312-555-5555" },
    "images": ["e1.jpg", "e2.jpg", "e3.jpg"],
    "is_featured": true,
    "createdAt": "2024-01-05T00:00:00.000Z",
    "updatedAt": "2024-01-05T00:00:00.000Z"
  },
  {
    "owner": "3",
    "name": "Seaside Retreat",
    "type": "House",
    "description": "Escape to this seaside house for a relaxing getaway.",
    "location": { "street": "456 Oceanfront Drive", "city": "Miami", "state": "FL", "zipcode": "33101" },
    "beds": 4,
    "baths": 3,
    "square_feet": 2800,
    "amenities": ["Beach Access", "Swimming Pool", "Balcony/Patio", "Smart TV", "Outdoor Grill/BBQ"],
    "rates": { "nightly": 500, "weekly": 2500 },
    "seller_info": { "name": "Sarah Wilson", "email": "sarah@gmail.com", "phone": "305-555-5555" },
    "images": ["f1.jpg", "f2.jpg", "f3.jpg"],
    "is_featured": true,
    "createdAt": "2024-01-06T00:00:00.000Z",
    "updatedAt": "2024-01-06T00:00:00.000Z"
  },
  {
    "owner": "4",
    "name": "Rustic Cabin in the Woods",
    "type": "Cottage Or Cabin",
    "description": "Experience nature in this cozy rustic cabin.",
    "location": { "street": "789 Forest Lane", "city": "Denver", "state": "CO", "zipcode": "80201" },
    "beds": 2,
    "baths": 1,
    "square_feet": 1100,
    "amenities": ["Fireplace", "Outdoor Grill/BBQ", "Hiking Trails Access", "Pet-Friendly"],
    "rates": { "nightly": 475, "weekly": 2000 },
    "seller_info": { "name": "Robert Anderson", "email": "robert@gmail.com", "phone": "303-555-5555" },
    "images": ["g1.jpg", "g2.jpg", "g3.jpg"],
    "is_featured": false,
    "createdAt": "2024-01-07T00:00:00.000Z",
    "updatedAt": "2024-01-07T00:00:00.000Z"
  },
  {
    "owner": "5",
    "name": "Ski-In/Ski-Out Chalet",
    "type": "Chalet",
    "description": "Hit the slopes from this cozy ski-in/ski-out chalet.",
    "location": { "street": "321 Mountain Road", "city": "Aspen", "state": "CO", "zipcode": "81611" },
    "beds": 3,
    "baths": 2,
    "square_feet": 1800,
    "amenities": ["Ski Equipment Storage", "Fireplace", "Balcony/Patio", "Smart TV"],
    "rates": { "nightly": 300, "weekly": 1100 },
    "seller_info": { "name": "Jennifer Martin", "email": "jennifer@gmail.com", "phone": "970-555-5555" },
    "images": ["h1.jpg", "h2.jpg", "h3.jpg"],
    "is_featured": false,
    "createdAt": "2024-01-08T00:00:00.000Z",
    "updatedAt": "2024-01-08T00:00:00.000Z"
  },
  {
    "owner": "6",
    "name": "Mountain View Retreat",
    "type": "House",
    "description": "Enjoy stunning mountain views from this spacious retreat.",
    "location": { "street": "600 Summit Drive", "city": "Boulder", "state": "CO", "zipcode": "80301" },
    "beds": 4,
    "baths": 3,
    "square_feet": 2400,
    "amenities": ["Mountain View", "Hiking Trails Access", "Air Conditioning", "Smart TV", "Outdoor Grill/BBQ"],
    "rates": { "weekly": 1000, "monthly": 3800 },
    "seller_info": { "name": "Lisa Taylor", "email": "lisa@gmail.com", "phone": "303-555-5555" },
    "images": ["i1.jpg", "i2.jpg", "i3.jpg"],
    "is_featured": false,
    "createdAt": "2024-01-09T00:00:00.000Z",
    "updatedAt": "2024-01-09T00:00:00.000Z"
  },
  {
    "owner": "7",
    "name": "Historic Downtown Loft",
    "type": "Apartment",
    "description": "Step back in time with a stay in this historic downtown loft.",
    "location": { "street": "123 History Lane", "city": "Philadelphia", "state": "PA", "zipcode": "19101" },
    "beds": 2,
    "baths": 1,
    "square_feet": 1200,
    "amenities": ["High-Speed Internet", "Air Conditioning", "Smart TV", "Coffee Maker"],
    "rates": { "weekly": 550, "monthly": 2100 },
    "seller_info": { "name": "Matthew Harris", "email": "matthew@gmail.com", "phone": "215-555-5555" },
    "images": ["j1.jpg", "j2.jpg", "j3.jpg"],
    "is_featured": false,
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-10T00:00:00.000Z"
  }
]

async function main() {
  console.log('🌱 Starting seed...')
  console.log('🔐 Hashing passwords with bcrypt...')

  // Hash passwords for all users
  const saltRounds = 10
  const usersWithHashedPasswords = await Promise.all(
    sampleUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash('password123', saltRounds)
    }))
  )

  // 1. Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.savedProperty.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.property.deleteMany({})
  await prisma.user.deleteMany({})
  console.log('✅ Existing data cleared')

  // 2. Create users
  console.log('👤 Creating users...')
  const createdUsers = await Promise.all(
    usersWithHashedPasswords.map(user => 
      prisma.user.create({ data: user })
    )
  )
  console.log(`✅ Created ${createdUsers.length} users`)

  // 3. Create properties
  console.log('\n🏠 Creating properties...')
  let createdCount = 0
  let skippedCount = 0

  for (const property of propertiesData) {
    const propertyType = propertyTypeMap[property.type] || 'APARTMENT'
    
    const ownerExists = createdUsers.find(u => u.id === property.owner)
    if (!ownerExists) {
      console.log(`⚠️  User ${property.owner} not found, skipping: ${property.name}`)
      skippedCount++
      continue
    }

    try {
      await prisma.property.create({
        data: {
          ownerId: property.owner,
          name: property.name,
          type: propertyType,
          description: property.description,
          street: property.location.street,
          city: property.location.city,
          state: property.location.state,
          zipcode: property.location.zipcode,
          beds: property.beds,
          baths: property.baths,
          squareFeet: property.square_feet,
          amenities: property.amenities,
          rates: property.rates,
          sellerName: property.seller_info.name,
          sellerEmail: property.seller_info.email,
          sellerPhone: property.seller_info.phone,
          images: property.images,
          isFeatured: property.is_featured,
          createdAt: new Date(property.createdAt),
          updatedAt: new Date(property.updatedAt)
        }
      })
      createdCount++
      console.log(`  ✅ Created: ${property.name}`)
    } catch (error) {
      console.log(`  ❌ Failed: ${property.name} - ${error.message}`)
      skippedCount++
    }
  }
  console.log(`✅ Created ${createdCount} properties, skipped ${skippedCount}`)

  // 4. Create saved properties for tenant
  console.log('\n⭐ Creating saved properties...')
  const tenantUser = createdUsers.find(u => u.email === 'tenant@example.com')
  
  if (tenantUser) {
    const allProperties = await prisma.property.findMany({
      take: 3,
      orderBy: { createdAt: 'asc' }
    })
    
    for (const property of allProperties) {
      try {
        await prisma.savedProperty.create({
          data: {
            userId: tenantUser.id,
            propertyId: property.id
          }
        })
        console.log(`  ✅ Saved: ${property.name}`)
      } catch (error) {
        console.log(`  ❌ Failed to save: ${property.name}`)
      }
    }
  }

  // 5. Create sample messages
  console.log('\n💬 Creating sample messages...')
  const firstProperty = await prisma.property.findFirst()
  const landlordUser = firstProperty ? createdUsers.find(u => u.id === firstProperty.ownerId) : null

  if (tenantUser && landlordUser && firstProperty) {
    await prisma.message.create({
      data: {
        senderId: tenantUser.id,
        receiverId: landlordUser.id,
        propertyId: firstProperty.id,
        content: 'Hi, I am interested in this property. Is it still available?',
        read: false,
        createdAt: new Date('2024-01-15T10:00:00.000Z')
      }
    })
    await prisma.message.create({
      data: {
        senderId: landlordUser.id,
        receiverId: tenantUser.id,
        propertyId: firstProperty.id,
        content: 'Yes, it is still available! Would you like to schedule a viewing?',
        read: false,
        createdAt: new Date('2024-01-15T11:30:00.000Z')
      }
    })
    console.log(`  ✅ Created messages about "${firstProperty.name}"`)
  }

  // 6. Display statistics
  console.log('\n📊 Seed Statistics:')
  const totalUsers = await prisma.user.count()
  const totalProperties = await prisma.property.count()
  const totalMessages = await prisma.message.count()
  
  console.log(`  👤 Users: ${totalUsers}`)
  console.log(`  🏠 Properties: ${totalProperties}`)
  console.log(`  💬 Messages: ${totalMessages}`)

  console.log('\n✨ Seed completed successfully!')
  console.log('\n🔑 Test Login Credentials:')
  console.log('  Tenant:  tenant@example.com / password123')
  console.log('  Landlord: john.doe@example.com / password123')
  console.log('  Admin:   admin@example.com / password123')
}

main()
  .catch((e) => {
    console.error('\n❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })