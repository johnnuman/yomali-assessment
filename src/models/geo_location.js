module.exports = (sequelize, DataTypes) => {
    return sequelize.define('GeoLocation', {
        geo_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        region: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
    }, {
        tableName: 'geo_locations',
        timestamps: false
    });
};
