module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OperatingSystem', {
        os_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        os_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'operating_systems',
        timestamps: false
    });
};
