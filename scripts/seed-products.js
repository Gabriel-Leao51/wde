const mongodb = require("mongodb");

// Seed catalogue. Every product is named after the photo it uses, so the image
// file is `<slug>.webp` and its licence and credit are recorded under the same
// slug in product-data/image-sources.json (see docs/design-direction.md).
//
// `featured: true` marks the products shown on the home page.
//
// Department names are the canonical (English) filter/query value - display
// labels are translated separately (see locales/*.json's "departments" key),
// same split as product title/summary/description vs. their translations.
module.exports = [
  // --- Electronics ---
  {
    _id: new mongodb.ObjectId("000000000000000000000002"),
    title: "Wireless Over-Ear Headphones",
    featured: true,
    department: "Electronics",
    summary: "Over-ear wireless headphones with rich sound and all-day comfort.",
    price: 99.99,
    description:
      "Wireless over-ear headphones with powerful drivers, soft memory-foam cushions and a padded headband, made for long listening sessions.",
    image: "wireless-over-ear-headphones.webp",
    translations: {
      pt: {
        title: "Fone de Ouvido sem Fio Over-Ear",
        summary: "Fone de ouvido over-ear sem fio com som rico e conforto o dia todo.",
        description:
          "Fone de ouvido over-ear sem fio com drivers potentes, almofadas macias de espuma viscoelástica e arco acolchoado, feito para longas sessões de audição.",
      },
    },
  },
  {
    _id: new mongodb.ObjectId("000000000000000000000003"),
    title: "Wireless Keyboard and Mouse",
    department: "Electronics",
    summary: "Slim wireless keyboard and mouse, practical for everyday use.",
    price: 119.99,
    description:
      "Slim wireless keyboard and matching mouse with a rechargeable battery, ideal for a tidy home or office desk.",
    image: "wireless-keyboard-and-mouse.webp",
    translations: {
      pt: {
        title: "Teclado e Mouse sem Fio",
        summary: "Teclado e mouse sem fio finos, práticos para o dia a dia.",
        description:
          "Teclado sem fio fino com mouse combinando e bateria recarregável, ideal para uma mesa organizada em casa ou no escritório.",
      },
    },
  },
  {
    title: "Compact Bluetooth Speaker",
    department: "Electronics",
    summary: "Pocket-sized speaker with clear sound for any room.",
    price: 39.99,
    description:
      "Compact Bluetooth speaker with a fabric grille, a carry loop and up to 10 hours of playback on a single charge.",
    image: "compact-bluetooth-speaker.webp",
    translations: {
      pt: {
        title: "Caixa de Som Bluetooth Compacta",
        summary: "Caixa de som de bolso com som nítido para qualquer ambiente.",
        description:
          "Caixa de som Bluetooth compacta com tela de tecido, alça para transporte e até 10 horas de reprodução com uma única carga.",
      },
    },
  },
  {
    title: "Desktop Monitor",
    department: "Electronics",
    summary: "Sharp, colourful display for work and entertainment.",
    price: 279.0,
    description:
      "Widescreen desktop monitor with slim bezels and vivid colours, ideal for productivity, design and streaming.",
    image: "desktop-monitor.webp",
    translations: {
      pt: {
        title: "Monitor de Mesa",
        summary: "Tela nítida e colorida para trabalho e entretenimento.",
        description:
          "Monitor widescreen de mesa com bordas finas e cores vivas, ideal para produtividade, design e streaming.",
      },
    },
  },
  {
    title: "USB-C Multiport Hub",
    department: "Electronics",
    summary: "One port in, all the connections you need.",
    price: 44.99,
    description:
      "Slim aluminium USB-C hub with HDMI, USB-A and SD card slots, turning a single laptop port into a full workstation.",
    image: "usb-c-multiport-hub.webp",
    translations: {
      pt: {
        title: "Hub USB-C Multiportas",
        summary: "Uma porta de entrada, todas as conexões de que você precisa.",
        description:
          "Hub USB-C fino de alumínio com HDMI, USB-A e leitor de cartão SD, transformando uma única porta do notebook em uma estação de trabalho completa.",
      },
    },
  },

  // --- Gaming ---
  {
    _id: new mongodb.ObjectId("000000000000000000000001"),
    title: "Red and Black Gaming Chair",
    featured: true,
    department: "Gaming",
    summary: "Comfortable racing-style gaming chair for long gaming sessions.",
    price: 249.99,
    launchDate: new Date("2025-01-15"),
    description:
      "Racing-style gaming chair in red and black with adjustable lumbar support, a reclining backrest and adjustable armrests. Ideal for long gaming or work sessions.",
    image: "red-and-black-gaming-chair.webp",
    translations: {
      pt: {
        title: "Cadeira Gamer Vermelha e Preta",
        summary: "Cadeira gamer estilo racing, confortável para longas sessões de jogo.",
        description:
          "Cadeira gamer estilo racing em vermelho e preto, com apoio lombar ajustável, encosto reclinável e apoios de braço ajustáveis. Ideal para longas sessões de jogo ou trabalho.",
      },
    },
  },
  {
    title: "Mechanical Keyboard",
    department: "Gaming",
    summary: "Tactile mechanical keyboard built for fast, precise typing.",
    price: 84.99,
    description:
      "Compact mechanical keyboard with tactile switches, durable keycaps and a sturdy frame, equally at home in games and long typing sessions.",
    image: "mechanical-keyboard.webp",
    translations: {
      pt: {
        title: "Teclado Mecânico",
        summary: "Teclado mecânico tátil feito para digitação rápida e precisa.",
        description:
          "Teclado mecânico compacto com switches táteis, teclas duráveis e estrutura resistente, ótimo tanto para jogos quanto para longas sessões de digitação.",
      },
    },
  },
  {
    title: "Wireless Gaming Mouse",
    department: "Gaming",
    summary: "Lightweight wireless mouse with a precise sensor.",
    price: 59.99,
    description:
      "Lightweight wireless gaming mouse with a high-precision sensor, low-latency connection and a comfortable ergonomic shape.",
    image: "wireless-gaming-mouse.webp",
    translations: {
      pt: {
        title: "Mouse Gamer sem Fio",
        summary: "Mouse sem fio leve com sensor de alta precisão.",
        description:
          "Mouse gamer sem fio leve com sensor de alta precisão, conexão de baixa latência e formato ergonômico confortável.",
      },
    },
  },
  {
    title: "Gaming Headset",
    department: "Gaming",
    summary: "Immersive over-ear headset for long gaming sessions.",
    price: 69.99,
    description:
      "Over-ear gaming headset with deep bass, a flexible boom microphone and soft cushions for hours of comfortable play.",
    image: "gaming-headset.webp",
    translations: {
      pt: {
        title: "Headset Gamer",
        summary: "Headset over-ear imersivo para longas sessões de jogo.",
        description:
          "Headset gamer over-ear com graves profundos, microfone flexível e almofadas macias para horas de jogo confortável.",
      },
    },
  },

  // --- Furniture ---
  {
    title: "Standing Desk",
    featured: true,
    department: "Furniture",
    summary: "Height-adjustable desk with a solid wood top.",
    price: 429.0,
    description:
      "Electric height-adjustable standing desk with a solid wood top and a steel frame, so you can switch between sitting and standing through the day.",
    image: "standing-desk.webp",
    translations: {
      pt: {
        title: "Mesa Ajustável para Ficar em Pé",
        summary: "Mesa com altura ajustável e tampo de madeira maciça.",
        description:
          "Mesa elétrica com altura ajustável, tampo de madeira maciça e estrutura de aço, para alternar entre ficar sentado e em pé ao longo do dia.",
      },
    },
  },
  {
    title: "Ergonomic Mesh Office Chair",
    department: "Furniture",
    summary: "Breathable mesh chair with full ergonomic support.",
    price: 199.99,
    description:
      "Ergonomic office chair with a breathable mesh back, adjustable headrest and lumbar support, and a smooth-rolling five-star base.",
    image: "ergonomic-mesh-office-chair.webp",
    translations: {
      pt: {
        title: "Cadeira de Escritório Ergonômica de Tela",
        summary: "Cadeira de tela respirável com suporte ergonômico completo.",
        description:
          "Cadeira de escritório ergonômica com encosto de tela respirável, apoio de cabeça e lombar ajustáveis e base de cinco pontas com rodízios suaves.",
      },
    },
  },
  {
    title: "Floating Wall Shelf Set",
    department: "Furniture",
    summary: "Clean wooden shelves that mount flush to the wall.",
    price: 34.99,
    description:
      "Set of floating wooden wall shelves with hidden brackets, for books, plants and keepsakes without floor space.",
    image: "floating-wall-shelf-set.webp",
    translations: {
      pt: {
        title: "Conjunto de Prateleiras Flutuantes",
        summary: "Prateleiras de madeira de linhas limpas que se fixam rentes à parede.",
        description:
          "Conjunto de prateleiras flutuantes de madeira com suportes ocultos, para livros, plantas e lembranças sem ocupar espaço no chão.",
      },
    },
  },
  {
    title: "Live-Edge Coffee Table",
    department: "Furniture",
    summary: "Solid wood coffee table with a natural live edge.",
    price: 189.0,
    description:
      "Solid wood coffee table with a natural live edge and slim metal legs, a warm centrepiece for any living room.",
    image: "live-edge-coffee-table.webp",
    translations: {
      pt: {
        title: "Mesa de Centro com Borda Natural",
        summary: "Mesa de centro de madeira maciça com borda natural.",
        description:
          "Mesa de centro de madeira maciça com borda natural e pés finos de metal, uma peça central acolhedora para qualquer sala.",
      },
    },
  },

  // --- Office ---
  {
    title: "Wooden Monitor Stand",
    department: "Office",
    summary: "Solid wood riser with room to tidy your desk.",
    price: 39.99,
    description:
      "Solid wood monitor stand that lifts your screen to eye level and keeps your keyboard, phone and notebooks neatly tucked underneath.",
    image: "wooden-monitor-stand.webp",
    translations: {
      pt: {
        title: "Suporte de Madeira para Monitor",
        summary: "Suporte de madeira maciça com espaço para organizar a mesa.",
        description:
          "Suporte de madeira maciça que eleva a tela à altura dos olhos e mantém teclado, celular e cadernos organizados por baixo.",
      },
    },
  },
  {
    title: "Compact Photo Printer",
    department: "Office",
    summary: "Pocket-sized printer for instant photos.",
    price: 89.99,
    description:
      "Compact wireless photo printer that turns pictures from your phone into small prints in under a minute.",
    image: "compact-photo-printer.webp",
    translations: {
      pt: {
        title: "Impressora Fotográfica Compacta",
        summary: "Impressora de bolso para fotos instantâneas.",
        description:
          "Impressora fotográfica sem fio compacta que transforma as fotos do celular em pequenas impressões em menos de um minuto.",
      },
    },
  },
  {
    title: "Copper Desk Lamp",
    department: "Office",
    summary: "Adjustable metal desk lamp with a warm copper finish.",
    price: 34.99,
    description:
      "Adjustable desk lamp with a brushed copper finish and a weighted base, giving focused warm light for reading and work.",
    image: "copper-desk-lamp.webp",
    translations: {
      pt: {
        title: "Luminária de Mesa Cobre",
        summary: "Luminária de mesa de metal ajustável com acabamento cobre.",
        description:
          "Luminária de mesa ajustável com acabamento cobre escovado e base com peso, oferecendo luz quente e focada para leitura e trabalho.",
      },
    },
  },
  {
    title: "Whiteboard Easel",
    department: "Office",
    summary: "Freestanding whiteboard for brainstorming and planning.",
    price: 59.0,
    description:
      "Freestanding magnetic whiteboard on a foldable wooden easel, perfect for brainstorming, planning and quick sketches.",
    image: "whiteboard-easel.webp",
    translations: {
      pt: {
        title: "Quadro Branco com Cavalete",
        summary: "Quadro branco de chão para brainstorm e planejamento.",
        description:
          "Quadro branco magnético de chão com cavalete de madeira dobrável, perfeito para brainstorm, planejamento e rascunhos rápidos.",
      },
    },
  },

  // --- Home ---
  {
    title: "Robot Vacuum Cleaner",
    featured: true,
    department: "Home",
    summary: "Self-driving vacuum that keeps floors clean on its own.",
    price: 199.0,
    description:
      "Slim robot vacuum that maps your rooms, glides under furniture and returns to its dock to recharge on its own.",
    image: "robot-vacuum-cleaner.webp",
    translations: {
      pt: {
        title: "Robô Aspirador de Pó",
        summary: "Aspirador autônomo que mantém o chão limpo sozinho.",
        description:
          "Robô aspirador fino que mapeia os cômodos, passa por baixo dos móveis e volta à base para recarregar sozinho.",
      },
    },
  },
  {
    title: "Gooseneck Kettle",
    department: "Home",
    summary: "Precision-pour electric kettle for tea and coffee.",
    price: 59.99,
    description:
      "Electric gooseneck kettle with a slim spout for a slow, controlled pour, ideal for pour-over coffee and loose-leaf tea.",
    image: "gooseneck-kettle.webp",
    translations: {
      pt: {
        title: "Chaleira Elétrica Bico de Ganso",
        summary: "Chaleira elétrica de despejo preciso para chá e café.",
        description:
          "Chaleira elétrica com bico fino de ganso para um despejo lento e controlado, ideal para café coado e chá em folhas.",
      },
    },
  },
  {
    title: "Air Purifier",
    department: "Home",
    summary: "Quiet purifier for cleaner air at home.",
    price: 129.0,
    description:
      "Quiet air purifier with a true HEPA filter that removes dust, pollen and odours in medium-sized rooms.",
    image: "air-purifier.webp",
    translations: {
      pt: {
        title: "Purificador de Ar",
        summary: "Purificador silencioso para um ar mais limpo em casa.",
        description:
          "Purificador de ar silencioso com filtro HEPA verdadeiro, remove poeira, pólen e odores em ambientes de tamanho médio.",
      },
    },
  },
  {
    title: "Vintage Filament Bulb",
    department: "Home",
    summary: "Warm, decorative bulb with a glowing spiral filament.",
    price: 9.99,
    description:
      "Decorative Edison-style LED bulb with a glowing spiral filament and warm white light, made to be seen in exposed fixtures.",
    image: "vintage-filament-bulb.webp",
    translations: {
      pt: {
        title: "Lâmpada Vintage de Filamento",
        summary: "Lâmpada decorativa e quente com filamento em espiral brilhante.",
        description:
          "Lâmpada LED decorativa estilo Edison com filamento em espiral brilhante e luz branca quente, feita para ficar à mostra em luminárias expostas.",
      },
    },
  },

  // --- Sports ---
  {
    title: "Yoga Mat and Cork Blocks",
    department: "Sports",
    summary: "Non-slip yoga mat with two cork blocks.",
    price: 39.99,
    description:
      "Extra-thick non-slip yoga mat with two natural cork blocks, everything you need to deepen your practice at home or in the studio.",
    image: "yoga-mat-and-cork-blocks.webp",
    translations: {
      pt: {
        title: "Tapete de Yoga e Blocos de Cortiça",
        summary: "Tapete de yoga antiderrapante com dois blocos de cortiça.",
        description:
          "Tapete de yoga extra grosso e antiderrapante com dois blocos de cortiça natural, tudo de que você precisa para aprofundar a prática em casa ou no estúdio.",
      },
    },
  },
  {
    title: "Rubber Hex Dumbbell",
    department: "Sports",
    summary: "Rubber-coated hex dumbbell that won't roll away.",
    price: 34.99,
    description:
      "Rubber-coated hex dumbbell with a knurled steel handle for a secure grip, and a shape that stays put on the floor.",
    image: "rubber-hex-dumbbell.webp",
    translations: {
      pt: {
        title: "Halter Hexagonal Emborrachado",
        summary: "Halter hexagonal emborrachado que não sai rolando.",
        description:
          "Halter hexagonal emborrachado com pegada de aço serrilhado para firmeza e um formato que fica parado no chão.",
      },
    },
  },
  {
    title: "Insulated Water Bottle",
    department: "Sports",
    summary: "Stainless steel bottle that keeps drinks cold or hot.",
    price: 24.99,
    description:
      "Double-wall stainless steel bottle with a soft-touch finish that keeps drinks cold for 24 hours or hot for 12.",
    image: "insulated-water-bottle.webp",
    translations: {
      pt: {
        title: "Garrafa Térmica de Água",
        summary: "Garrafa de aço inoxidável que mantém as bebidas geladas ou quentes.",
        description:
          "Garrafa de aço inoxidável de parede dupla com acabamento soft-touch, mantém as bebidas geladas por 24 horas ou quentes por 12.",
      },
    },
  },
];
