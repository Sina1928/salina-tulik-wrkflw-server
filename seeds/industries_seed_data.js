/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("industries").del();
  await knex("industries").insert([
    {
      id: 1,
      name: "Construction",
      description:
        "Industry involved in the building of infrastructure, residential, and commercial properties.",
    },
    {
      id: 2,
      name: "Healthcare",
      description:
        "Industry focused on providing medical services, including hospitals, clinics, pharmaceuticals, and medical device manufacturing.",
    },
    {
      id: 3,
      name: "Retail",
      description:
        "Industry that sells goods and products directly to consumers. This includes everything from small local shops to large department stores.",
    },
    {
      id: 4,
      name: "Finance",
      description:
        "Industry that provides financial services including banking, insurance, wealth management, investment, and more.",
    },
    {
      id: 5,
      name: "Technology",
      description:
        "Industry involved in the development and manufacturing of technology products and services, such as software development, IT services, and telecommunications.",
    },
    {
      id: 6,
      name: "Education",
      description:
        "Industry that provides educational services, including public and private schools, universities, tutoring services, and online education platforms.",
    },
    {
      id: 7,
      name: "Hospitality",
      description:
        "Industry focused on customer service, lodging, food and beverage service, and tourism. This includes hotels, restaurants, and event management.",
    },
    {
      id: 8,
      name: "Manufacturing",
      description:
        "Industry that produces and processes goods from raw materials, including everything from food processing to electronics manufacturing.",
    },
    {
      id: 9,
      name: "Logistics & Transportation",
      description:
        "Industry focused on the transportation and storage of goods, including shipping, railroads, trucking, and warehousing.",
    },
    {
      id: 10,
      name: "Real Estate",
      description:
        "Industry dealing with buying, selling, and renting properties such as residential, commercial, and industrial buildings.",
    },
    {
      id: 11,
      name: "Agriculture",
      description:
        "Industry that involves the cultivation of plants and livestock farming for food, fibers, biofuel, and other products.",
    },
    {
      id: 12,
      name: "Energy",
      description:
        "Industry concerned with the production and distribution of energy, including oil, gas, electricity, renewable energy (solar, wind, etc.).",
    },
    {
      id: 13,
      name: "Media & Entertainment",
      description:
        "Industry that includes content creation, news broadcasting, movies, television, music, and digital entertainment platforms.",
    },
    {
      id: 14,
      name: "Legal Services",
      description:
        "Industry that provides legal representation, advice, and document preparation, including law firms and independent attorneys.",
    },
    {
      id: 15,
      name: "Beauty & Personal Care",
      description:
        "Industry related to beauty products, salons, spas, and other personal care services that focus on wellness and aesthetics.",
    },
    {
      id: 16,
      name: "Nonprofit",
      description:
        "Organizations that focus on social causes, charity, advocacy, or public service and rely on donations, grants, and volunteers rather than profit generation.",
    },
    {
      id: 17,
      name: "Automotive",
      description:
        "Industry that includes the production, sale, and servicing of motor vehicles, as well as auto parts and repair services.",
    },
    {
      id: 18,
      name: "Fashion",
      description:
        "Industry involved in the design, manufacturing, distribution, and retail of clothing, accessories, and footwear.",
    },
  ]);
};
