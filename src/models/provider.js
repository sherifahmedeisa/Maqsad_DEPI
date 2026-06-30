module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ProviderProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    serviceTags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('serviceTags');
        return raw ? JSON.parse(raw) : [];
      },
      set(value) {
        this.setDataValue('serviceTags', JSON.stringify(value || []));
      },
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avgRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    totalProposals: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });
};
