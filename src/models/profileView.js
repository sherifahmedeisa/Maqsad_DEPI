module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ProfileView', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    viewedUserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    viewerUserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    viewerCountry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    viewerCompany: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });
};