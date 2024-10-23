/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      email: "annie@kcl.com",
      password: "hashed_password",
      googleId: null,
      first_name: "Annie",
      last_name: "Smith",
    },
    {
      id: 2,
      email: "janice@glamour2go.com",
      password: "hashed_password",
      googleId: null,
      first_name: "Janice",
      last_name: "McCleod",
    },
    {
      id: 3,
      email: "carlo@kcl.com",
      password: "hashed_password",
      googleId: null,
      first_name: "Carlo",
      last_name: "Fernandez",
    },
    {
      id: 4,
      email: "harleen@living-wellness.com",
      password: "hashed_password",
      googleId: null,
      first_name: "Harleen",
      last_name: "Singh",
    },
  ]);
}
