/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      email: "annie@kcl.com",
      password: "hashed_password",
      google_id: null,
      first_name: "Annie",
      last_name: "Smith",
      company_id: 1,
    },
    {
      id: 2,
      email: "janice@glamour2go.com",
      password: "hashed_password",
      google_id: null,
      first_name: "Janice",
      last_name: "McCleod",
      company_id: 2,
    },
    {
      id: 3,
      email: "carlo@kcl.com",
      password: "hashed_password",
      google_id: null,
      first_name: "Carlo",
      last_name: "Fernandez",

      company_id: 1,
    },
    {
      id: 4,
      email: "harleen@living-wellness.com",
      password: "hashed_password",
      google_id: null,
      first_name: "Harleen",
      last_name: "Singh",
      company_id: 3,
    },
  ]);
};
