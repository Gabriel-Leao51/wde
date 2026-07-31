require("dotenv").config();

const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");
const DEPARTMENTS = require("../utils/departments");

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

// Department names are the canonical (English) filter/query value - display
// labels are translated separately (see locales/*.json's "departments" key),
// same split as product title/summary/description vs. their translations.
const DEPARTMENT_COLORS = {
  Electronics: "#2980b9",
  Gaming: "#c0392b",
  Furniture: "#8e44ad",
  Office: "#16a085",
  Home: "#d35400",
  Sports: "#27ae60",
};

const PRODUCTS = [
  // --- Electronics ---
  {
    _id: new mongodb.ObjectId("000000000000000000000002"),
    title: "JBL Headphones",
    department: "Electronics",
    summary: "JBL headphones with powerful, comfortable audio.",
    price: 89.9,
    description:
      "Over-ear JBL headphones, with powerful drivers and comfortable cushions for extended use.",
    image: "45478fcc-4482-4067-af2c-08448e93e6c5-61KmVBD4ZfL._AC_SX522_.jpg",
    translations: {
      pt: {
        title: "Fone de Ouvido JBL",
        summary: "Fone de ouvido JBL com áudio potente e confortável.",
        description:
          "Fone de ouvido JBL over-ear, com drivers potentes e almofadas confortáveis para uso prolongado.",
      },
    },
  },
  {
    _id: new mongodb.ObjectId("000000000000000000000003"),
    title: "Wireless Keyboard and Mouse Kit",
    department: "Electronics",
    summary: "Wireless keyboard and mouse kit, practical for everyday use.",
    price: 129.9,
    description:
      "Wireless keyboard and mouse kit with USB connection, ideal for home or office use.",
    image:
      "c998c0d4-afc2-45e0-9911-9f70420813f0-c6e1f239-0471-4e63-94aa-c359f126cb52-51IPtedWrsL.__AC_SX300_SY300_QL70_ML2_.jpg",
    translations: {
      pt: {
        title: "Kit Teclado e Mouse sem Fio",
        summary: "Kit teclado e mouse sem fio, prático para o dia a dia.",
        description:
          "Kit com teclado e mouse sem fio, conexão via USB, ideal para uso doméstico ou no escritório.",
      },
    },
  },
  {
    title: "Bluetooth Portable Speaker",
    department: "Electronics",
    summary: "Compact speaker with rich sound for on-the-go listening.",
    price: 59.99,
    description:
      "Portable Bluetooth speaker with up to 12 hours of battery life and water-resistant housing.",
    generateImage: true,
    translations: {
      pt: {
        title: "Caixa de Som Bluetooth Portátil",
        summary: "Caixa de som compacta com som potente para usar em qualquer lugar.",
        description:
          "Caixa de som Bluetooth portátil com até 12 horas de bateria e proteção contra respingos.",
      },
    },
  },
  {
    title: "27-Inch 4K Monitor",
    department: "Electronics",
    summary: "Sharp 4K display for work and entertainment.",
    price: 329.0,
    description:
      "27-inch 4K UHD monitor with slim bezels, ideal for productivity, design, and gaming.",
    generateImage: true,
    translations: {
      pt: {
        title: "Monitor 4K de 27 Polegadas",
        summary: "Tela 4K nítida para trabalho e entretenimento.",
        description:
          "Monitor 4K UHD de 27 polegadas com bordas finas, ideal para produtividade, design e jogos.",
      },
    },
  },
  {
    title: "USB-C Charging Hub",
    department: "Electronics",
    summary: "Multi-port hub for charging and connecting devices.",
    price: 34.5,
    description:
      "USB-C hub with HDMI, USB-A, and SD card slots, expanding a single port into a full workstation.",
    generateImage: true,
    translations: {
      pt: {
        title: "Hub de Carregamento USB-C",
        summary: "Hub multiportas para carregar e conectar dispositivos.",
        description:
          "Hub USB-C com HDMI, USB-A e leitor de cartão SD, transformando uma única porta em uma estação de trabalho completa.",
      },
    },
  },

  // --- Gaming ---
  {
    _id: new mongodb.ObjectId("000000000000000000000001"),
    title: "GTRACING - Black Gaming Chair",
    department: "Gaming",
    summary: "Comfortable gaming chair for long gaming sessions.",
    price: 249.99,
    launchDate: new Date("2025-01-15"),
    description:
      "Black GTRACING gaming chair with adjustable lumbar support, reclining backrest, and adjustable armrests. Ideal for long gaming or work sessions.",
    image:
      "9b147a0d-d2ee-450a-b188-4b6ee7eb777d-c9a8f77d-39ac-4050-b1d5-a527ecb3b8ea-gaming-chair.webp",
    translations: {
      pt: {
        title: "GTRACING - Cadeira Gamer Preta",
        summary: "Cadeira gamer confortável para longas sessões de jogo.",
        description:
          "Cadeira gamer GTRACING na cor preta, com apoio lombar ajustável, encosto reclinável e braços ajustáveis. Ideal para longas sessões de jogo ou trabalho.",
      },
    },
  },
  {
    title: "Mechanical Gaming Keyboard",
    department: "Gaming",
    summary: "Responsive mechanical keyboard with RGB backlighting.",
    price: 89.99,
    description:
      "Mechanical gaming keyboard with tactile switches, per-key RGB lighting, and a durable aluminum frame.",
    generateImage: true,
    translations: {
      pt: {
        title: "Teclado Mecânico Gamer",
        summary: "Teclado mecânico responsivo com iluminação RGB.",
        description:
          "Teclado mecânico gamer com switches táteis, iluminação RGB por tecla e estrutura de alumínio resistente.",
      },
    },
  },
  {
    title: "RGB Gaming Mouse",
    department: "Gaming",
    summary: "Precision gaming mouse with customizable RGB lighting.",
    price: 39.99,
    description:
      "High-precision gaming mouse with adjustable DPI, programmable buttons, and RGB lighting.",
    generateImage: true,
    translations: {
      pt: {
        title: "Mouse Gamer RGB",
        summary: "Mouse gamer de precisão com iluminação RGB personalizável.",
        description:
          "Mouse gamer de alta precisão com DPI ajustável, botões programáveis e iluminação RGB.",
      },
    },
  },
  {
    title: "Gaming Headset with Mic",
    department: "Gaming",
    summary: "Surround sound headset with a noise-canceling microphone.",
    price: 54.99,
    description:
      "Gaming headset with virtual surround sound, a noise-canceling boom microphone, and plush ear cushions.",
    generateImage: true,
    translations: {
      pt: {
        title: "Headset Gamer com Microfone",
        summary: "Headset com som surround e microfone com cancelamento de ruído.",
        description:
          "Headset gamer com som surround virtual, microfone boom com cancelamento de ruído e almofadas macias.",
      },
    },
  },

  // --- Furniture ---
  {
    title: "Adjustable Standing Desk",
    department: "Furniture",
    summary: "Electric standing desk that adjusts from sitting to standing height.",
    price: 399.0,
    description:
      "Electric height-adjustable standing desk with a sturdy steel frame and a spacious desktop.",
    generateImage: true,
    translations: {
      pt: {
        title: "Mesa Ajustável para Ficar em Pé",
        summary: "Mesa elétrica que ajusta da altura sentada para em pé.",
        description:
          "Mesa elétrica com altura ajustável, estrutura de aço resistente e tampo espaçoso.",
      },
    },
  },
  {
    title: "Ergonomic Office Chair",
    department: "Furniture",
    summary: "Breathable mesh office chair with lumbar support.",
    price: 189.99,
    description:
      "Ergonomic office chair with breathable mesh back, adjustable lumbar support, and armrests.",
    generateImage: true,
    translations: {
      pt: {
        title: "Cadeira de Escritório Ergonômica",
        summary: "Cadeira de escritório em tela respirável com apoio lombar.",
        description:
          "Cadeira de escritório ergonômica com encosto em tela respirável, apoio lombar ajustável e braços.",
      },
    },
  },
  {
    title: "Bookshelf - 5 Tier",
    department: "Furniture",
    summary: "5-tier bookshelf for books, décor, and storage.",
    price: 79.0,
    description:
      "Sturdy 5-tier bookshelf, ideal for books, plants, and decorative storage in any room.",
    generateImage: true,
    translations: {
      pt: {
        title: "Estante - 5 Prateleiras",
        summary: "Estante de 5 prateleiras para livros, decoração e organização.",
        description:
          "Estante resistente de 5 prateleiras, ideal para livros, plantas e itens decorativos em qualquer ambiente.",
      },
    },
  },
  {
    title: "Wooden Coffee Table",
    department: "Furniture",
    summary: "Solid wood coffee table with a minimalist design.",
    price: 149.99,
    description:
      "Solid wood coffee table with a minimalist design, sized to fit comfortably in front of any sofa.",
    generateImage: true,
    translations: {
      pt: {
        title: "Mesa de Centro de Madeira",
        summary: "Mesa de centro de madeira maciça com design minimalista.",
        description:
          "Mesa de centro de madeira maciça com design minimalista, com tamanho ideal para qualquer sofá.",
      },
    },
  },

  // --- Office ---
  {
    title: "Desk Organizer Set",
    department: "Office",
    summary: "Multi-compartment organizer to keep your desk tidy.",
    price: 19.99,
    description:
      "Desk organizer set with multiple compartments for pens, notes, and small office supplies.",
    generateImage: true,
    translations: {
      pt: {
        title: "Organizador de Mesa",
        summary: "Organizador com múltiplos compartimentos para manter sua mesa arrumada.",
        description:
          "Conjunto organizador de mesa com vários compartimentos para canetas, anotações e itens de escritório.",
      },
    },
  },
  {
    title: "Wireless Printer",
    department: "Office",
    summary: "Compact wireless printer for home or office use.",
    price: 129.0,
    description:
      "Compact wireless all-in-one printer with mobile printing support, ideal for home or office.",
    generateImage: true,
    translations: {
      pt: {
        title: "Impressora sem Fio",
        summary: "Impressora sem fio compacta para uso doméstico ou escritório.",
        description:
          "Impressora multifuncional sem fio e compacta, com suporte para impressão via celular, ideal para casa ou escritório.",
      },
    },
  },
  {
    title: "LED Desk Lamp",
    department: "Office",
    summary: "Adjustable LED lamp with multiple brightness settings.",
    price: 24.99,
    description:
      "LED desk lamp with adjustable brightness and color temperature, plus a flexible gooseneck arm.",
    generateImage: true,
    translations: {
      pt: {
        title: "Luminária de Mesa LED",
        summary: "Luminária LED ajustável com vários níveis de brilho.",
        description:
          "Luminária de mesa LED com brilho e temperatura de cor ajustáveis, além de haste flexível.",
      },
    },
  },
  {
    title: "Whiteboard - 36x24 in",
    department: "Office",
    summary: "Magnetic dry-erase whiteboard for notes and planning.",
    price: 45.0,
    description:
      "36x24 inch magnetic dry-erase whiteboard with an aluminum frame, includes markers and an eraser.",
    generateImage: true,
    translations: {
      pt: {
        title: "Quadro Branco - 36x24 pol",
        summary: "Quadro branco magnético para anotações e planejamento.",
        description:
          "Quadro branco magnético de 36x24 polegadas com moldura de alumínio, acompanha marcadores e apagador.",
      },
    },
  },

  // --- Home ---
  {
    title: "Robot Vacuum Cleaner",
    department: "Home",
    summary: "Automatic vacuum that cleans your floors for you.",
    price: 249.99,
    description:
      "Robot vacuum cleaner with smart navigation, strong suction, and app-based scheduling.",
    generateImage: true,
    translations: {
      pt: {
        title: "Robô Aspirador de Pó",
        summary: "Aspirador automático que limpa o chão para você.",
        description:
          "Robô aspirador com navegação inteligente, sucção potente e agendamento via aplicativo.",
      },
    },
  },
  {
    title: "Electric Kettle",
    department: "Home",
    summary: "Fast-boiling electric kettle with auto shut-off.",
    price: 29.99,
    description:
      "1.7-liter electric kettle with rapid boiling, auto shut-off, and boil-dry protection.",
    generateImage: true,
    translations: {
      pt: {
        title: "Chaleira Elétrica",
        summary: "Chaleira elétrica de fervura rápida com desligamento automático.",
        description:
          "Chaleira elétrica de 1,7 litros com fervura rápida, desligamento automático e proteção contra fervura em vazio.",
      },
    },
  },
  {
    title: "Air Purifier",
    department: "Home",
    summary: "HEPA air purifier for cleaner indoor air.",
    price: 119.0,
    description:
      "Air purifier with a true HEPA filter, removing dust, pollen, and odors from medium-sized rooms.",
    generateImage: true,
    translations: {
      pt: {
        title: "Purificador de Ar",
        summary: "Purificador de ar HEPA para um ar mais limpo em casa.",
        description:
          "Purificador de ar com filtro HEPA verdadeiro, remove poeira, pólen e odores em ambientes de tamanho médio.",
      },
    },
  },
  {
    title: "Smart LED Light Bulb (4-Pack)",
    department: "Home",
    summary: "App-controlled color-changing smart bulbs, 4-pack.",
    price: 34.99,
    description:
      "Set of 4 smart LED bulbs with app and voice control, millions of colors, and dimmable white light.",
    generateImage: true,
    translations: {
      pt: {
        title: "Lâmpada Inteligente LED (Kit com 4)",
        summary: "Lâmpadas inteligentes com troca de cor, controladas por aplicativo, kit com 4.",
        description:
          "Kit com 4 lâmpadas LED inteligentes com controle por aplicativo e voz, milhões de cores e luz branca ajustável.",
      },
    },
  },

  // --- Sports ---
  {
    title: "Yoga Mat",
    department: "Sports",
    summary: "Non-slip yoga mat for home or studio workouts.",
    price: 24.99,
    description:
      "Extra-thick non-slip yoga mat, lightweight and easy to carry to the studio or the park.",
    generateImage: true,
    translations: {
      pt: {
        title: "Tapete de Yoga",
        summary: "Tapete de yoga antiderrapante para treinos em casa ou no estúdio.",
        description:
          "Tapete de yoga extra grosso e antiderrapante, leve e fácil de carregar para o estúdio ou o parque.",
      },
    },
  },
  {
    title: "Adjustable Dumbbell Set",
    department: "Sports",
    summary: "Space-saving dumbbells with adjustable weight.",
    price: 149.0,
    description:
      "Adjustable dumbbell set replacing multiple pairs of weights, ideal for home workouts.",
    generateImage: true,
    translations: {
      pt: {
        title: "Kit de Halteres Ajustáveis",
        summary: "Halteres com peso ajustável, ideais para economizar espaço.",
        description:
          "Kit de halteres ajustáveis que substitui vários pares de peso, ideal para treinos em casa.",
      },
    },
  },
  {
    title: "Running Water Bottle",
    department: "Sports",
    summary: "Lightweight, leak-proof bottle for runs and workouts.",
    price: 14.99,
    description:
      "Lightweight, leak-proof water bottle with an ergonomic grip, built for running and everyday workouts.",
    generateImage: true,
    translations: {
      pt: {
        title: "Garrafa de Água para Corrida",
        summary: "Garrafa leve e à prova de vazamento para corridas e treinos.",
        description:
          "Garrafa de água leve e à prova de vazamento com pegada ergonômica, feita para corridas e treinos do dia a dia.",
      },
    },
  },
];

function wrapText(text, maxCharsPerLine) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Generates a simple, deterministic SVG placeholder (product name + a
// department-coded background) instead of fetching stock photos - avoids
// both licensing risk and a network dependency during seeding.
function generatePlaceholderSvg(productName, department) {
  const color = DEPARTMENT_COLORS[department] || "#555555";
  const lines = wrapText(productName, 20).slice(0, 3);
  const startY = 225 - (lines.length - 1) * 16;

  const nameLines = lines
    .map(function (line, index) {
      const y = startY + index * 32;
      return `<text x="300" y="${y}" font-family="sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">${escapeXml(line)}</text>`;
    })
    .join("\n  ");

  const departmentY = startY + lines.length * 32 + 12;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <rect width="600" height="450" fill="${color}" />
  ${nameLines}
  <text x="300" y="${departmentY}" font-family="sans-serif" font-size="16" fill="#ffffff" text-anchor="middle" opacity="0.8">${escapeXml(department)}</text>
</svg>`;
}

function slugifyFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (const productData of PRODUCTS) {
    const existingProduct = await productsCollection.findOne({ title: productData.title });

    if (existingProduct) {
      console.log(`Product already exists, skipping: ${productData.title}`);
      seededProducts[productData.title] = existingProduct;
      continue;
    }

    if (productData.generateImage) {
      const filename = `${slugifyFilename(productData.title)}.svg`;
      const svg = generatePlaceholderSvg(productData.title, productData.department);
      fs.writeFileSync(path.join(IMAGES_DIR, filename), svg);
      productData.image = filename;
      delete productData.generateImage;
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
