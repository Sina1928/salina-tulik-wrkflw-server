import express from "express";
import passport from "passport";
// import { validateSignup, validateLogin } from "../middleware/validation.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/signup", async (_req, res) => {
  const { email, password, firstName, lastName, companyName, industryId } =
    _req.body;

  // Manual Validation

  const errors = {};

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors({ message: "Invalid email format." });
  }

  if (!password || password.length < 6) {
    errors({ message: "Password must be greater than 6 characters long." });
  }

  if (!companyName || companyName.trim() === "") {
    errors({ message: "Company name cannot be empty." });
  }

  if (!industryId || isNaN(industryId)) {
    errors({ message: "Industry id must be a valid number." });
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const trx = await knex.transaction();

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

    const hashedPw = await bcrypt.hash(password, 10);

    const [user] = await trx("users")
      .insert({
        email,
        password: hashedPw,
        firstName,
        lastName,
        created_at: trx.fn.now(),
      })
      .returning("*");

    const [company] = await trx("companies")
      .insert({
        name: companyName,
        industry_id: industryId,
        created_at: trx.fn.now(),
      })
      .returning("*");

    await trx("user_company").insert({
      user_id: user.id,
      company_id: company.id,
      role: "owner",
    });

    await trx.commit();

    const token = generateToken(user);
    res.status(201).json({
      message: "Account successfully created",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      company: {
        id: company.id,
        name: company.name,
      },
    });
  } catch (err) {
    await trx.rollback();
    console.error("Signup error: ", err);
    res.status(500).json({ error: "Error creating user: " });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await knex("users").where({ email }).first();

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
      return res.status(400).json({ message: "Password Invalid" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("Login error: ", err);
    res.status(500).json({ message: "Server error" });
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
