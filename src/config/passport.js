const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user ? user.toJSON() : null);
  } catch (error) {
    done(error);
  }
});

const createStrategy = ({ Strategy, clientID, clientSecret, callbackURL, providerName }) => {
  if (!clientID || !clientSecret) {
    return;
  }

  passport.use(
    providerName,
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const oauthId = profile.id;
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const provider = profile.provider;
          const displayName = profile.displayName || profile.username || 'Unknown User';
          const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
          const requestedRole = req.session?.oauthRole || 'client';

          let user = await User.findOne({ where: { oauthProvider: provider, oauthId } });
          if (!user && email) {
            user = await User.findOne({ where: { email } });
          }

          if (!user) {
            user = await User.create({
              oauthProvider: provider,
              oauthId,
              displayName,
              email,
              avatarUrl,
              role: ['client', 'provider', 'admin'].includes(requestedRole) ? requestedRole : 'client',
              providerVerified: provider === 'github' || provider === 'google',
            });
          }

          if (!user.role) {
            user.role = 'client';
            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
};

const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

createStrategy({
  Strategy: GoogleStrategy,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${baseUrl}/auth/google/callback`,
  providerName: 'google',
});

createStrategy({
  Strategy: GitHubStrategy,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${baseUrl}/auth/github/callback`,
  providerName: 'github',
});
