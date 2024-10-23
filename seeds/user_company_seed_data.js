/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user_company").del();
  await knex("user_company").insert([
    { user_id: 1, company_id: 1, role: "Admin" },
    { user_id: 2, company_id: 2, role: "Manager" },
    { user_id: 3, company_id: 3, role: "Employee" },
    { user_id: 2, company_id: 3, role: "Manager" },
  ]);
};
