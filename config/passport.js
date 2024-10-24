import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";

// app.use(passport.initialize());
// app.use(passport.session());

export const configurePassport = (knex) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          let user = await knex("users").where({ email }).first;

          if (user) {
            if (!user.googleId) {
              await knex("users").where({ email }).update({
                accessToken,
                refreshToken,
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
              });
            }
          } else {
            [user] = await knex("users")
              .insert({
                email,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                googleId: profile.id,
                accessToken,
                refreshToken,
                created_at: knex.fn.now(),
              })
              .returning("*");
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

  return passport;
};
