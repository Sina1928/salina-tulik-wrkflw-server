/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("business_requirements").del();
  await knex("business_requirements").insert([
    { industry_id: 1 }, // Construction Industry
    { industry_id: 2 }, // Healthcare Industry
    { industry_id: 15 }, // Beauty Industry
  ]);
}
