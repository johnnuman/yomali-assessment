module.exports = (sequelize, DataTypes) => {
    return sequelize.define('DeviceType', {
        device_type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        device_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'device_types',
        timestamps: false
    });
};
