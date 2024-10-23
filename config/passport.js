import passport, { authenticate } from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      s;
      try {
        let user = await knex("users").where({ email }).first;

        user = await knex("users")
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
