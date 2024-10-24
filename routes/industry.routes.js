import express from "express";
const router = express.Router();
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

router.get("", async (_req, res) => {
  try {
    const industries = await knex("industries").select(
      "id",
      "name",
      "description"
    );
    res.status(200).json(industries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch industries: " });
  }
});

router.get("/:id/components", async (req, res) => {
  const { id } = req.params;
  try {
    const components = await knex("components")
      .select("components.*")
      .join(
        "business_requirements_components",
        "components.id",
        "business_requirements_components.component_id"
      )
      .join(
        "business_requirements",
        "business_requirements_components.business_requirement_id",
        "business_requirements.id"
      )
      .where("business_requirements.industry_id", id);
    res.status(200).json(components);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch components: ", err });
  }
});

export default router;
