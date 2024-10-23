/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("components").del();
  await knex("components").insert([
    {
      id: 1,
      name: "Invoicing",
      description: "Manage invoices and track payments.",
    },
    {
      id: 2,
      name: "Document Management",
      description: "Organize and store all important documents.",
    },
    {
      id: 3,
      name: "Safety Compliance",
      description: "Ensure safety protocols and compliance tracking.",
    },
    {
      id: 4,
      name: "Time Tracking",
      description: "Track employee work hours and project times.",
    },
    {
      id: 5,
      name: "Payroll",
      description: "Handle employee salaries, deductions, and payouts.",
    },
    {
      id: 6,
      name: "Project Management",
      description: "Organize and manage project tasks and milestones.",
    },
    {
      id: 7,
      name: "Marketing Tools",
      description: "Create and manage marketing campaigns and assets.",
    },
    {
      id: 8,
      name: "Booking System",
      description: "Allow customers to schedule appointments and services.",
    },
    {
      id: 9,
      name: "Inventory Management",
      description: "Track stock levels and product inventory.",
    },
    {
      id: 10,
      name: "Client Relationship Management (CRM)",
      description: "Manage client data and interactions.",
    },
  ]);
}
