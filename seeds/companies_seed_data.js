/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("companies").del();
  await knex("companies").insert([
    {
      id: 1,
      name: "KCL",
      logo: "logo_url_1",
      theme_color: "#FF5733",
      website: "kcl.com",
      industry_id: 1,
    },
    {
      id: 2,
      name: "Glamour2Go",
      logo: "logo_url_2",
      theme_color: "#C70039",
      website: "glamour2go.com",
      industry_id: 15,
    },
    {
      id: 3,
      name: "living wellness",
      logo: "logo_url_3",
      theme_color: "#86a774",
      website: "living-wellness.com",
      industry_id: 2,
    },
  ]);
};
