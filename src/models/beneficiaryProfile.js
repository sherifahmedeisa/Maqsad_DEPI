module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BeneficiaryProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });
};