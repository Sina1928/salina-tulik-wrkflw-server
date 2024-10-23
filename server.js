import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import passport from "passport";
import cookieSession from "cookie-session";
import "dotenv/config";

const app = express();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:";

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req, res) => {
  res.send("Welcome to Wrkflw's Server");
});

app.post("/signup", async (_req, res) => {
  const { email, password } = _req.body;
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
      res
        .status(201)
        .json({
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await knex("users").where({ email }).first;
      try {
        const user = await knex("users")
          .where({ email })
          .update({ accessToken, refreshToken });
        if (user && !user.googleId) {
          await knex("users").where({ email }).update({ googleId: profile.id });
          user.googleId = profile.id;
        } else {
          const user = await knex("users").insert({
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            accessToken,
            refreshToken,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await knex("users").where({ id }).first();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

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

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/current_user", (req, res) => {
  res.send(req.user);
});

app.listen(PORT, () => {
  console.log(`Server running on ${BACKEND_URL}${PORT}`);
});
