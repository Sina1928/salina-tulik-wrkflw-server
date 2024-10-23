/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("companies").del();
  await knex("companies").insert([
    {
      id: 1,
      name: "KCL",
      logo_url: "logo_url_1",
      theme_color: "#FF5733",
      website_url: "kcl.com",
      industry_id: 1,
    },
    {
      id: 2,
      name: "Glamour2Go",
      logo_url: "logo_url_2",
      theme_color: "#C70039",
      website_url: "glamour2go.com",
      industry_id: 15,
    },
    {
      id: 3,
      name: "living wellness",
      logo_url: "logo_url_3",
      theme_color: "#86a774",
      website_url: "living-wellness.com",
      industry_id: 2,
    },
  ]);
}
