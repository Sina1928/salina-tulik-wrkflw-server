/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("industries").del();
  await knex("industries").insert([
    {
      name: "Construction",
      description:
        "Industry involved in the building of infrastructure, residential, and commercial properties.",
    },
    {
      name: "Healthcare",
      description:
        "Industry focused on providing medical services, including hospitals, clinics, pharmaceuticals, and medical device manufacturing.",
    },
    {
      name: "Retail",
      description:
        "Industry that sells goods and products directly to consumers. This includes everything from small local shops to large department stores.",
    },
    {
      name: "Finance",
      description:
        "Industry that provides financial services including banking, insurance, wealth management, investment, and more.",
    },
    {
      name: "Technology",
      description:
        "Industry involved in the development and manufacturing of technology products and services, such as software development, IT services, and telecommunications.",
    },
    {
      name: "Education",
      description:
        "Industry that provides educational services, including public and private schools, universities, tutoring services, and online education platforms.",
    },
    {
      name: "Hospitality",
      description:
        "Industry focused on customer service, lodging, food and beverage service, and tourism. This includes hotels, restaurants, and event management.",
    },
    {
      name: "Manufacturing",
      description:
        "Industry that produces and processes goods from raw materials, including everything from food processing to electronics manufacturing.",
    },
    {
      name: "Logistics & Transportation",
      description:
        "Industry focused on the transportation and storage of goods, including shipping, railroads, trucking, and warehousing.",
    },
    {
      name: "Real Estate",
      description:
        "Industry dealing with buying, selling, and renting properties such as residential, commercial, and industrial buildings.",
    },
    {
      name: "Agriculture",
      description:
        "Industry that involves the cultivation of plants and livestock farming for food, fibers, biofuel, and other products.",
    },
    {
      name: "Energy",
      description:
        "Industry concerned with the production and distribution of energy, including oil, gas, electricity, renewable energy (solar, wind, etc.).",
    },
    {
      name: "Media & Entertainment",
      description:
        "Industry that includes content creation, news broadcasting, movies, television, music, and digital entertainment platforms.",
    },
    {
      name: "Legal Services",
      description:
        "Industry that provides legal representation, advice, and document preparation, including law firms and independent attorneys.",
    },
    {
      name: "Beauty & Personal Care",
      description:
        "Industry related to beauty products, salons, spas, and other personal care services that focus on wellness and aesthetics.",
    },
    {
      name: "Nonprofit",
      description:
        "Organizations that focus on social causes, charity, advocacy, or public service and rely on donations, grants, and volunteers rather than profit generation.",
    },
    {
      name: "Automotive",
      description:
        "Industry that includes the production, sale, and servicing of motor vehicles, as well as auto parts and repair services.",
    },
    {
      name: "Fashion",
      description:
        "Industry involved in the design, manufacturing, distribution, and retail of clothing, accessories, and footwear.",
    },
  ]);
}
