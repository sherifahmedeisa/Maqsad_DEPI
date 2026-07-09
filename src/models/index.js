const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('./user');
const BeneficiaryProfileModel = require('./beneficiaryProfile');
const ProviderProfileModel = require('./provider');
const EmailVerificationModel = require('./emailVerification');
const PasswordResetModel = require('./passwordReset');
const RFPModel = require('./serviceRequest');
const ProposalModel = require('./proposal');
const MessageThreadModel = require('./messageThread');
const MessageModel = require('./message');
const NotificationModel = require('./notification');
const ProfileViewModel = require('./profileView');
const MatchingScoreModel = require('./matchingScore');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required to run this application.');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: require('pg'), // Explicitly pass the pg module for Vercel's bundler
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = UserModel(sequelize, DataTypes);
const BeneficiaryProfile = BeneficiaryProfileModel(sequelize, DataTypes);
const ProviderProfile = ProviderProfileModel(sequelize, DataTypes);
const EmailVerification = EmailVerificationModel(sequelize, DataTypes);
const PasswordReset = PasswordResetModel(sequelize, DataTypes);
const RFP = RFPModel(sequelize, DataTypes);
const Proposal = ProposalModel(sequelize, DataTypes);
const MessageThread = MessageThreadModel(sequelize, DataTypes);
const Message = MessageModel(sequelize, DataTypes);
const Notification = NotificationModel(sequelize, DataTypes);
const ProfileView = ProfileViewModel(sequelize, DataTypes);
const MatchingScore = MatchingScoreModel(sequelize, DataTypes);

User.hasMany(EmailVerification, { foreignKey: 'userId', as: 'emailVerifications' });
EmailVerification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(PasswordReset, { foreignKey: 'userId', as: 'passwordResets' });
PasswordReset.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(BeneficiaryProfile, { foreignKey: 'userId', as: 'beneficiaryProfile' });
BeneficiaryProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(ProviderProfile, { foreignKey: 'userId', as: 'providerProfile' });
ProviderProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(RFP, { foreignKey: 'beneficiaryId', as: 'rfps' });
RFP.belongsTo(User, { foreignKey: 'beneficiaryId', as: 'beneficiary' });

User.hasMany(RFP, { foreignKey: 'providerId', as: 'receivedRequests' });
RFP.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

User.hasMany(Proposal, { foreignKey: 'providerId', as: 'proposals' });
Proposal.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(ProfileView, { foreignKey: 'viewedUserId', as: 'profileViewsReceived' });
User.hasMany(ProfileView, { foreignKey: 'viewerUserId', as: 'profileViews' });
ProfileView.belongsTo(User, { foreignKey: 'viewedUserId', as: 'viewedUser' });
ProfileView.belongsTo(User, { foreignKey: 'viewerUserId', as: 'viewerUser' });

RFP.hasMany(Proposal, { foreignKey: 'rfpId', as: 'proposals' });
Proposal.belongsTo(RFP, { foreignKey: 'rfpId', as: 'rfp' });

RFP.hasMany(MessageThread, { foreignKey: 'rfpId', as: 'threads' });
MessageThread.belongsTo(RFP, { foreignKey: 'rfpId', as: 'rfp' });

RFP.hasMany(MatchingScore, { foreignKey: 'rfpId', as: 'matchingScores' });
MatchingScore.belongsTo(RFP, { foreignKey: 'rfpId', as: 'rfp' });

MessageThread.hasMany(Message, { foreignKey: 'threadId', as: 'messages' });
Message.belongsTo(MessageThread, { foreignKey: 'threadId', as: 'thread' });

MessageThread.belongsTo(User, { foreignKey: 'beneficiaryId', as: 'beneficiary' });
MessageThread.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

MatchingScore.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

const initializeDatabase = async () => {
  // On serverless environments (Vercel), skip schema sync to avoid cold-start delays and race conditions,
  // unless explicitly forced via env variable.
  if (process.env.VERCEL && process.env.DB_FORCE_SYNC !== 'true') {
    console.log('Skipping database sync on Vercel serverless environment.');
    return;
  }

  const syncOptions = { alter: true };
  if (process.env.DB_FORCE_SYNC === 'true') {
    syncOptions.force = true;
  }

  const modelsInOrder = [
    User,
    EmailVerification,
    PasswordReset,
    BeneficiaryProfile,
    ProviderProfile,
    RFP,
    Proposal,
    MessageThread,
    Message,
    Notification,
    ProfileView,
    MatchingScore
  ];

  try {
    for (const model of modelsInOrder) {
      await model.sync(syncOptions);
    }
    console.log('Database synced successfully in sequence.');
  } catch (syncError) {
    console.warn('Schema alter failed, retrying with force sync:', syncError.message);
    for (const model of modelsInOrder) {
      await model.sync({ force: true });
    }
    console.log('Database force-synced successfully in sequence.');
  }
};

module.exports = {
  sequelize,
  User,
  BeneficiaryProfile,
  ProviderProfile,
  EmailVerification,
  PasswordReset,
  RFP,
  Proposal,
  MessageThread,
  Message,
  Notification,
  ProfileView,
  MatchingScore,
  initializeDatabase,
};
