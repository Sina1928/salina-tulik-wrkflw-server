app.get("/industries/:id/components", async (req, res) => {
  const { id } = req.params;
  try {
    const components = await knex("components").where({ industry_id: id });
    res.status(200).json(components);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch components: ", err });
  }
});
