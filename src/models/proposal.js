module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Proposal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rfpId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    proposedBudget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimatedDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attachmentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn'),
      allowNull: false,
      defaultValue: 'submitted',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: false,
  });
};
