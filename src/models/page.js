module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Page', {
        page_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        page_url: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'pages',
        timestamps: false
    });
};
