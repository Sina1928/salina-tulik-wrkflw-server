/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("business_requirements").del();
  await knex("business_requirements").insert([
    { id: 1, industry_id: 1 }, // Construction Industry
    { id: 2, industry_id: 2 }, // Healthcare Industry
    { id: 3, industry_id: 15 }, // Beauty Industry
  ]);
}
