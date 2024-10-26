module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Browser', {
        browser_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        browser_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'browsers',
        timestamps: false
    });
};
