module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        first_visit: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        last_visit: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        timestamps: false
    });
};
