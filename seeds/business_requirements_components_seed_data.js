/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("business_requirements_components").del();
  await knex("business_requirements_components").insert([
    { business_requirement_id: 1, component_id: 1 }, // Construction Industry / Invoicing
    { business_requirement_id: 1, component_id: 2 }, // Construction Industry / Document Management
    { business_requirement_id: 1, component_id: 3 }, // Construction Industry / Safety Compliance
    { business_requirement_id: 1, component_id: 4 }, // Construction Industry / Time Tracking
    { business_requirement_id: 1, component_id: 5 }, // Construction Industry / Payroll
    { business_requirement_id: 1, component_id: 6 }, // Construction Industry / Project Management
    { business_requirement_id: 2, component_id: 1 }, // Healthcare Industry / Invoicing
    { business_requirement_id: 2, component_id: 2 }, // Healthcare Industry / Document Management
    { business_requirement_id: 2, component_id: 3 }, // Healthcare Industry / Safety Compliance
    { business_requirement_id: 2, component_id: 5 }, // Healthcare Industry / Payroll
    { business_requirement_id: 2, component_id: 8 }, // Healthcare Industry / Booking System
    { business_requirement_id: 2, component_id: 9 }, // Healthcare Industry / Inventory Mangement
    { business_requirement_id: 2, component_id: 10 }, // Healthcare Industry / Client Relationship Management (CRM)
    { business_requirement_id: 3, component_id: 1 }, // Beauty Industry / Invoicing
    { business_requirement_id: 3, component_id: 2 }, // Beauty Industry / Document Management
    { business_requirement_id: 3, component_id: 7 }, // Beauty Industry / Marketing Tools
    { business_requirement_id: 3, component_id: 8 }, // Beauty Industry / Booking System
    { business_requirement_id: 3, component_id: 9 }, // Beauty Industry / Inventory Management
    { business_requirement_id: 3, component_id: 10 }, // Beauty Industry / Client Relationship Management (CRM)
  ]);
}
