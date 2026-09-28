require("dotenv").config();

const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");
const PRODUCTS = require("./seed-products");

const FIXED_ORDER_ID = "67c24c3795e7c7c7456bb9af";
const IMAGES_DIR = path.join(__dirname, "..", "product-data", "images");

const USERS = [
  {
    email: "admin@test.com",
    password: "tester",
    name: "Admin",
    address: { street: "Admin St 1", postalCode: "00000", city: "Admin City" },
    isAdmin: true,
  },
  {
    email: "user2@example.com",
    password: "usertest",
    name: "User B",
    address: { street: "Customer St 2", postalCode: "11111", city: "Customer City" },
    isAdmin: false,
  },
];

async function seedUsers() {
  const usersCollection = db.getDb().collection("users");
  const seededUsers = {};

  for (const userData of USERS) {
    const existingUser = await usersCollection.findOne({ email: userData.email });

    if (existingUser) {
      console.log(`User already exists, skipping: ${userData.email}`);
      seededUsers[userData.email] = existingUser;
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const userDocument = {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      address: userData.address,
      isAdmin: userData.isAdmin,
    };

    const result = await usersCollection.insertOne(userDocument);
    userDocument._id = result.insertedId;
    seededUsers[userData.email] = userDocument;

    console.log(`Seeded user: ${userData.email}`);
  }

  return seededUsers;
}

async function seedProducts() {
  const productsCollection = db.getDb().collection("products");
  const seededProducts = {};


  for (const productData of PRODUCTS) {
    const existingProduct = await productsCollection.findOne({ title: productData.title });

    if (existingProduct) {
      console.log(`Product already exists, skipping: ${productData.title}`);
      seededProducts[productData.title] = existingProduct;
      continue;
    }

    if (!fs.existsSync(path.join(IMAGES_DIR, productData.image))) {
      console.warn(`Image missing for ${productData.title}: run npm run images:fetch`);
    }

    const result = await productsCollection.insertOne(productData);
    productData._id = result.insertedId;
    seededProducts[productData.title] = productData;

    console.log(`Seeded product: ${productData.title}`);
  }

  return seededProducts;
}

async function seedOrder(customerUser, chairProduct) {
  const ordersCollection = db.getDb().collection("orders");
  const orderId = new mongodb.ObjectId(FIXED_ORDER_ID);

  const existingOrder = await ordersCollection.findOne({ _id: orderId });

  if (existingOrder) {
    console.log(`Order already exists, skipping: ${FIXED_ORDER_ID}`);
    return;
  }

  const orderDocument = {
    _id: orderId,
    userData: {
      _id: customerUser._id,
      email: customerUser.email,
      name: customerUser.name,
      address: customerUser.address,
    },
    productData: {
      items: [
        {
          product: {
            id: chairProduct._id.toString(),
            title: chairProduct.title,
            summary: chairProduct.summary,
            price: chairProduct.price,
            description: chairProduct.description,
            image: chairProduct.image,
            imagePath: `product-data/images/${chairProduct.image}`,
            imageUrl: `/products/assets/images/${chairProduct.image}`,
          },
          quantity: 1,
          totalPrice: chairProduct.price,
        },
      ],
      totalQuantity: 1,
      totalPrice: chairProduct.price,
    },
    date: new Date(),
    status: "pending",
  };

  await ordersCollection.insertOne(orderDocument);
  console.log(`Seeded order: ${FIXED_ORDER_ID}`);
}

async function seed() {
  await db.connectToDatabase();

  const users = await seedUsers();
  const products = await seedProducts();

  await seedOrder(users["user2@example.com"], products["Red and Black Gaming Chair"]);

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
