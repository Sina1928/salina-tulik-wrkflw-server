import express from "express";
import { validateSignup, validateLogin } from "../middleware/validation.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcrypt";

app.post("/signup", async (_req, res) => {
  const { email, password, companyName, industry_id } = _req.body;

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

  if (!industry_id || isNaN(industry_id)) {
    errors({ message: "Industry id must be a valid number." });
  }

  if (errors > 0) {
    return res.status(400).json({ errors });
  }

  const hashedPw = await bcrypt.hash(password, 10);
  try {
    const existingUser = await knex("users").where({ email }).first();
    if (existingUser && existingUser.googleId) {
      return res.status(400).json({
        error:
          "User already exists under a Google account. Please login with your Google account or select 'Forgot Email/Password'.",
      });
    }

    if (!existingUser) {
      const newUser = await knex("users").insert({ email, password: hashedPw });
      const newComapny = await knex("companies").insert({
        name: companyName,
        industry_id,
      });

      await knex("user_company").insert({
        user_id: newUser.id,
        company_id: newComapny.id,
      });
      res.status(201).json({
        message: "User successfully created",
        user: newUser,
        company: newComapny,
      });
    } else {
      res.status(400).json({ error: "User already exists." });
    }
  } catch (err) {
    res.status(500).json({ error: "Error creating user: ", err });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const isPasswordValid = await bcrypt.compare(password, user.password);

  try {
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found. Invalid credentials." });
    }

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password Invalid" });
    }

    req.session.user = user;
  } catch (err) {
    res.status(500).json({ message: "Server error: ", err });
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (_req, res) => {
    res.redirect("/dashboard");
  }
);

export default Router;
