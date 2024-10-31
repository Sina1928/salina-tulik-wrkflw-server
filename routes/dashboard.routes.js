import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";

const router = express.Router();
const knex = initKnex(configuration);

router.get("/:companyId", async (req, res) => {
  const { companyId } = req.params;
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  try {
    const components = await knex("company_components")
      .where({ company_id: companyId, status: "active" })
      .select("component_id");

    const dashboardData = {};

    await Promise.all(
      components.map(async ({ component_id }) => {
        switch (component_id) {
          case 1: // Invoicing
            const [invoiceMetrics] = await knex("invoices")
              .where("company_id", companyId)
              .where("created_at", ">=", thirtyDaysAgo)
              .select([
                knex.raw("COALESCE(SUM(amount), 0) as total_revenue"),
                knex.raw(
                  'COUNT(CASE WHEN status = "pending" THEN 1 END) as pending_invoices'
                ),
                knex.raw(
                  'COUNT(CASE WHEN status = "paid" THEN 1 END) as paid_invoices'
                ),
              ]);

            const recentInvoices = await knex("invoices")
              .where("company_id", companyId)
              .orderBy("created_at", "desc")
              .limit(5)
              .select(["id", "amount", "status", "due_date", "client_name"]);

            dashboardData.invoicing = {
              totalRevenue: Number(invoiceMetrics.total_revenue),
              pendingInvoices: Number(invoiceMetrics.pending_invoices),
              paidInvoices: Number(invoiceMetrics.paid_invoices),
              recentInvoices: recentInvoices.map((inv) => ({
                id: inv.id,
                amount: Number(inv.amount),
                status: inv.status,
                dueDate: inv.due_date,
                clientName: inv.client_name,
              })),
            };
            break;

          case 2: // Document Management
            const [docMetrics] = await knex("documents")
              .where("company_id", companyId)
              .select([
                knex.raw("COUNT(*) as total_documents"),
                knex.raw(
                  'COUNT(CASE WHEN status = "pending_review" THEN 1 END) as pending_review'
                ),
              ]);

            const recentDocuments = await knex("documents")
              .where("company_id", companyId)
              .orderBy("created_at", "desc") // Changed from uploaded_date to created_at
              .limit(5)
              .select(["id", "name", "file_type", "status", "created_at"]); // Updated selected columns

            dashboardData.documents = {
              totalDocuments: Number(docMetrics.total_documents),
              pendingReview: Number(docMetrics.pending_review),
              recentDocuments: recentDocuments.map((doc) => ({
                id: doc.id,
                name: doc.name,
                type: doc.file_type,
                status: doc.status,
                uploadedDate: doc.created_at,
              })),
            };
            break;

          case 3: // Safety Compliance
            const [safetyMetrics] = await knex("safety_incidents")
              .where("company_id", companyId)
              .select([
                knex.raw("COUNT(*) as total_incidents"),
                knex.raw(
                  'COUNT(CASE WHEN status = "open" OR status = "investigating" THEN 1 END) as open_incidents'
                ),
              ]);

            const incidents = await knex("safety_incidents")
              .where("company_id", companyId)
              .orderBy("created_at", "desc")
              .limit(5)
              .select([
                "id",
                "incident_type",
                "description",
                "severity",
                "status",
                "report_date",
              ]);

            dashboardData.safety = {
              totalIncidents: Number(safetyMetrics.total_incidents || 0),
              openIncidents: Number(safetyMetrics.open_incidents || 0),
              incidents: incidents.map((incident) => ({
                id: incident.id,
                incident_type: incident.incident_type,
                description: incident.description,
                severity: incident.severity,
                status: incident.status,
                report_date: incident.report_date,
              })),
            };
            break;

          case 4: // Time Tracking
            const timeMetrics = await knex("time_entries")
              .where("company_id", companyId)
              .where("entry_date", ">=", thirtyDaysAgo)
              .select([
                knex.raw("COALESCE(SUM(hours), 0) as total_hours"),
                knex.raw("COUNT(DISTINCT project_name) as active_projects"),
              ])
              .first();

            const weeklyHours = await knex("time_entries")
              .where("company_id", companyId)
              .whereBetween("entry_date", [
                new Date(new Date().setDate(today.getDate() - 7)),
                today,
              ])
              .select([
                "entry_date as date",
                "project_name as project",
                knex.raw("SUM(hours) as hours"),
              ])
              .groupBy("entry_date", "project_name")
              .orderBy("entry_date");

            dashboardData.timeTracking = {
              totalHours: Number(timeMetrics?.total_hours || 0),
              activeProjects: Number(timeMetrics?.active_projects || 0),
              weeklyHours: weeklyHours.map((entry) => ({
                date: entry.date,
                hours: Number(entry.hours),
                project: entry.project || "General",
              })),
            };
            break;

          case 9: // Inventory Management
            const [inventoryMetrics] = await knex("inventory_items")
              .where("company_id", companyId)
              .select([
                knex.raw("COUNT(*) as total_items"),
                knex.raw(
                  "COUNT(CASE WHEN current_stock <= reorder_point THEN 1 END) as low_stock"
                ),
              ]);

            const recentMovements = await knex("inventory_movements")
              .where("company_id", companyId)
              .orderBy("date", "desc")
              .limit(5)
              .select(["id", "item", "type", "quantity", "date"]);

            dashboardData.inventory = {
              totalItems: Number(inventoryMetrics.total_items),
              lowStock: Number(inventoryMetrics.low_stock),
              recentMovements: recentMovements.map((movement) => ({
                id: movement.id,
                item: movement.item,
                type: movement.type,
                quantity: movement.quantity,
                date: movement.date,
              })),
            };
            break;

          case 5: // Payroll
            const [payrollMetrics] = await knex("payroll_records")
              .where("company_id", companyId)
              .select([
                knex.raw("COALESCE(SUM(amount), 0) as total_payroll"),
                knex.raw(
                  'COUNT(CASE WHEN status = "pending" THEN 1 END) as pending_approvals'
                ),
              ]);

            const nextPayroll = await knex("payroll_records")
              .where("company_id", companyId)
              .where("status", "pending")
              .orderBy("payment_date", "asc")
              .first();

            const recentPayments = await knex("payroll_records")
              .where("company_id", companyId)
              .orderBy("created_at", "desc")
              .limit(5)
              .select([
                "id",
                "employee_name",
                "amount",
                "status",
                "payment_date",
              ]);

            dashboardData.payroll = {
              totalPayroll: Number(payrollMetrics.total_payroll || 0),
              pendingApprovals: Number(payrollMetrics.pending_approvals || 0),
              nextPayrollDate: nextPayroll?.payment_date,
              recentPayments: recentPayments.map((payment) => ({
                id: payment.id,
                employeeName: payment.employee_name,
                amount: Number(payment.amount),
                status: payment.status,
                date: payment.payment_date,
              })),
            };
            break;

          case 6: // Project Management
            const [projectMetrics] = await knex("project_tasks")
              .where("company_id", companyId)
              .select([
                knex.raw("COUNT(DISTINCT project_name) as total_projects"),
                knex.raw(
                  'COUNT(CASE WHEN status = "pending" OR status = "in_progress" THEN 1 END) as pending_tasks'
                ),
                knex.raw(
                  'COUNT(CASE WHEN status = "completed" THEN 1 END) as completed_tasks'
                ),
              ]);

            const tasks = await knex("project_tasks")
              .where("company_id", companyId)
              .orderBy("due_date", "asc")
              .limit(5)
              .select([
                "id",
                "project_name",
                "task_name",
                "status",
                "due_date",
                "assigned_to",
              ]);

            dashboardData.projects = {
              tasks: tasks.map((task) => ({
                id: task.id,
                project_name: task.project_name,
                task_name: task.task_name,
                status: task.status,
                due_date: task.due_date,
                assigned_to: task.assigned_to,
              })),
              totalProjects: Number(projectMetrics.total_projects || 0),
              pendingTasks: Number(projectMetrics.pending_tasks || 0),
              completedTasks: Number(projectMetrics.completed_tasks || 0),
            };
            break;

          case 10: // CRM
            const [crmMetrics] = await knex("client_interactions")
              .where("company_id", companyId)
              .select([
                knex.raw("COUNT(DISTINCT client_name) as total_clients"),
                knex.raw(
                  'COUNT(CASE WHEN status = "pending" THEN 1 END) as active_leads'
                ),
              ]);

            const recentInteractions = await knex("client_interactions")
              .where("company_id", companyId)
              .orderBy("date", "desc")
              .limit(5)
              .select(["id", "client_name", "type", "date", "status"]);

            dashboardData.crm = {
              totalClients: Number(crmMetrics.total_clients),
              activeLeads: Number(crmMetrics.active_leads),
              recentInteractions: recentInteractions.map((interaction) => ({
                id: interaction.id,
                clientName: interaction.client_name,
                type: interaction.type,
                date: interaction.date,
                status: interaction.status,
              })),
            };
            break;
        }
      })
    );

    res.json(dashboardData);
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
    res.status(500).json({
      error: "Failed to fetch dashboard data",
      details: err.message,
    });
  }
});

export default router;
