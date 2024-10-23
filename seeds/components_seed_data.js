/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("components").del();
  await knex("components").insert([
    {
      name: "Invoicing",
      description: "Manage invoices and track payments.",
    },
    {
      name: "Document Management",
      description: "Organize and store all important documents.",
    },
    {
      name: "Safety Compliance",
      description: "Ensure safety protocols and compliance tracking.",
    },
    {
      name: "Time Tracking",
      description: "Track employee work hours and project times.",
    },
    {
      name: "Payroll",
      description: "Handle employee salaries, deductions, and payouts.",
    },
    {
      name: "Project Management",
      description: "Organize and manage project tasks and milestones.",
    },
    {
      name: "Marketing Tools",
      description: "Create and manage marketing campaigns and assets.",
    },
    {
      name: "Booking System",
      description: "Allow customers to schedule appointments and services.",
    },
    {
      name: "Inventory Management",
      description: "Track stock levels and product inventory.",
    },
    {
      name: "Client Relationship Management (CRM)",
      description: "Manage client data and interactions.",
    },
  ]);
};
