module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('beneficiary', 'provider', 'admin'),
      allowNull: false,
      defaultValue: 'beneficiary',
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePictureUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountStatus: {
      type: DataTypes.ENUM('pending', 'active', 'suspended'),
      allowNull: false,
      defaultValue: 'pending',
    },
    subscriptionTier: {
      type: DataTypes.ENUM('free', 'premium'),
      allowNull: false,
      defaultValue: 'free',
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
};
