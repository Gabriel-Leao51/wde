require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");

const FIXED_ORDER_ID = "67c24c3795e7c7c7456bb9af";

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

const PRODUCTS = [
  {
    _id: new mongodb.ObjectId("000000000000000000000001"),
    title: "GTRACING - Black Gaming Chair",
    summary: "Cadeira gamer confortável para longas sessões de jogo.",
    price: 249.99,
    description:
      "Cadeira gamer GTRACING na cor preta, com apoio lombar ajustável, encosto reclinável e braços ajustáveis. Ideal para longas sessões de jogo ou trabalho.",
    image:
      "9b147a0d-d2ee-450a-b188-4b6ee7eb777d-c9a8f77d-39ac-4050-b1d5-a527ecb3b8ea-gaming-chair.webp",
  },
  {
    _id: new mongodb.ObjectId("000000000000000000000002"),
    title: "Fone de Ouvido JBL",
    summary: "Fone de ouvido JBL com áudio potente e confortável.",
    price: 89.9,
    description:
      "Fone de ouvido JBL over-ear, com drivers potentes e almofadas confortáveis para uso prolongado.",
    image: "45478fcc-4482-4067-af2c-08448e93e6c5-61KmVBD4ZfL._AC_SX522_.jpg",
  },
  {
    _id: new mongodb.ObjectId("000000000000000000000003"),
    title: "Kit Teclado e Mouse sem Fio",
    summary: "Kit teclado e mouse sem fio, prático para o dia a dia.",
    price: 129.9,
    description:
      "Kit com teclado e mouse sem fio, conexão via USB, ideal para uso doméstico ou no escritório.",
    image:
      "c998c0d4-afc2-45e0-9911-9f70420813f0-c6e1f239-0471-4e63-94aa-c359f126cb52-51IPtedWrsL.__AC_SX300_SY300_QL70_ML2_.jpg",
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

  await seedOrder(users["user2@example.com"], products["GTRACING - Black Gaming Chair"]);

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
