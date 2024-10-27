import express from "express";
import passport from "passport";
// import { validateSignup, validateLogin } from "../middleware/validation.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcrypt";
import multer from "multer";
import initKnex from "knex";
import configuration from "../knexfile.js";
import { v4 as uuid4 } from "uuid";

const router = express.Router();
const knex = initKnex(configuration);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/logos");
  },
  filename: (_req, file, cb) => {
    const uniqueFileName = `${uuid4()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

router.post("/signup", upload.single("logoUrl"), async (_req, res) => {
  const trx = await knex.transaction();

  const {
    email,
    password,
    firstName,
    lastName,
    companyName,
    // companyAddress,
    industryId,
    websiteUrl,
    themeColor,
    selectedComponents,
    // role = "owner",
  } = _req.body;

  const componentsArray =
    typeof selectedComponents === "string"
      ? JSON.parse(selectedComponents)
      : selectedComponents;

  // Manual Validation

  const errors = {};

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be greater than 6 characters long." });
  }

  if (!companyName || companyName.trim() === "") {
    return res.status(400).json({ message: "Company name cannot be empty." });
  }

  if (!industryId || isNaN(industryId)) {
    return res
      .status(400)
      .json({ message: "Industry id must be a valid number." });
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await trx("users").where({ email }).first();

    if (existingUser) {
      await trx.rollback();
      return res.status(400).json({
        error: existingUser.googleId
          ? "User already exists with Google Account. Please login with Google."
          : "User already exists.",
      });
    }

    const logoUrl = _req.file;
    // ? `/uploads/logos/${_req.file.filename}` : null;

    const hashedPw = await bcrypt.hash(password, 10);

    const [userId] = await trx("users").insert({
      email,
      password: hashedPw,
      first_name: firstName,
      last_name: lastName,
      created_at: trx.fn.now(),
    });

    const [companyId] = await trx("companies").insert({
      name: companyName,
      // address: companyAddress,
      website_url: websiteUrl,
      logo_url: logoUrl?.path,
      theme_color: themeColor,
      industry_id: industryId,
      created_at: trx.fn.now(),
    });

    await trx("user_company").insert({
      user_id: userId,
      company_id: companyId,
      role: "admin",
    });

    if (componentsArray?.length > 0) {
      await trx("company_components");
      const addComponents = componentsArray.map((componentId) => ({
        company_id: companyId,
        component_id: componentId,
        status: "active",
      }));

      await trx("company_components").insert(addComponents);
    }

    await trx.commit();

    const user = await knex("users").where({ id: userId }).first();

    const companyData = await knex("companies")
      .select([
        "companies.*",
        knex.raw(
          "GROUP_CONCAT(companyComponents.component_id) as component_ids"
        ),
      ])
      .leftJoin(
        "company_components as companyComponents",
        "companies.id",
        "companyComponents.company_id"
      )
      .where("companies.id", companyId)
      .groupBy("companies.id")
      .first();

    //   const formattedCompany = {
    //     id: companyData.id,
    //     name: companyData.id,
    //   }

    // if (companyData.component_ids) {
    //   companyData.component_ids = companyData.component_ids
    //     .split(",")
    //     .map(Number);
    // } else {
    //   companyData.component_ids = [];
    // }

    const token = generateToken(user);

    res.status(201).json({
      message: "Account successfully created",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      company: {
        id: companyData.id,
        name: companyData.name,
        logoUrl: companyData.logo_url,
        themeColor: companyData.theme_color,
        industryId: companyData.industry_id,
        componentIds: companyData.component_ids.split(",").map(Number),
      },
    });
  } catch (err) {
    await trx.rollback();
    console.error("Signup error: ", err);
    res.status(500).json({ error: "Error creating user: " });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await knex("users").where({ email }).first();

    // const user = await knex("users")
    //   .select([
    //     "users.*",
    //     "companies.id as company_id",
    //     "companies.name as company_name",
    //     "companies.logo_url",
    //     "companies.theme_color",
    //     "companies.industry_id",
    //     "business_requirements_components.component_id",
    //   ])
    //   .where("users.email", email)
    //   .leftJoin("user_company", "users.id", "user_company.user_id")
    //   .leftJoin("companies", "user_company.company_id", "companies.id")
    //   .leftJoin(
    //     "business_requirements_components",
    //     "companies.id",
    //     "business_requirements_components.company_id"
    //   )
    //   .first();

    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found. Invalid credentials." });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({ error: "Please log in with Google." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // const userCompanyCount = await knex("user_company")
    //   .where("user_id", user.id)
    //   .count("company_id as count")
    //   .first();

    // const userCompanies =
    //   userCompanyCount > 1
    //     ? await knex("companies")
    //         .select([
    //           "companies.id",
    //           "companies.name",
    //           "companies.logo_url",
    //           "companies.theme_color",
    //           "companies.industry_id",
    //         ])
    //         .join("user_company", "companies.id")
    //         .where("user_company.user_id", user.id)
    //     : [];

    // const components = await knex("business_requirements_components")
    //   .select("component_id")
    //   .where("company_id", user.company_id);

    const userCompanies = await knex("companies")
      .select([
        "companies.*",
        knex.raw(
          "GROUP_CONCAT(companyComponents.component_id) as componentIds"
        ),
      ])
      .leftJoin("user_company", "companies.id", "user_company.company_id")
      .leftJoin(
        "company_components as companyComponents",
        "companies.id",
        "companyComponents.company_id"
      )
      .where("user_company.user_id", user.id)
      .groupBy("companies.id");

    const primaryCompany = await knex("companies")
      .select([
        "companies.*",
        knex.raw(
          "GROUP_CONCAT(companyComponents.component_id) as componentIds"
        ),
      ])
      .leftJoin("user_company", "companies.id", "user_company.company_id")
      .leftJoin(
        "company_components as companyComponents",
        "companies.id",
        "companyComponents.company_id"
      )
      .where("user_company.user_id", user.id)
      .groupBy("companies.id")
      .first();

    const formattedCompanies = userCompanies.map((company) => ({
      id: company.id,
      name: company.name,
      logoUrl: company.logo_url,
      themeColor: company.theme_color,
      industryId: company.industry_id,
      componentIds: company.componentIds
        ? company.componentIds.split(",").map(Number)
        : [],
    }));

    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
      },
      company: {
        id: primaryCompany.id,
        name: primaryCompany.name,
        logoUrl: primaryCompany.logo_url,
        themeColor: primaryCompany.theme_color,
        industryId: primaryCompany.industry_id,
        componentIds: primaryCompany.componentIds
          ? primaryCompany.componentIds.split(",").map(Number)
          : [],
      },
      multipleCompanies: userCompanies > 1,
      companies: formattedCompanies,
    });
  } catch (err) {
    console.error("Login error: ", err);
    res.status(500).json({ message: "Server error occured during login" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect("/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
  res.json({ message: "Logged out successfully" });
});

export default router;
