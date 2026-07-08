module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MessageThread', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rfpId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    beneficiaryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });
};