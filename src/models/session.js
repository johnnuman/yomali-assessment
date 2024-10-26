module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Session', {
        session_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: 'users',
                key: 'user_id',
            },
        },
        page_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'pages',
                key: 'page_id',
            },
        },
        browser_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'browsers',
                key: 'browser_id',
            },
        },
        os_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'operating_systems',
                key: 'os_id',
            },
        },
        device_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'device_types',
                key: 'device_type_id',
            },
        },
        geo_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'geo_locations',
                key: 'geo_id',
            },
        },
        ip_address: {
            type: DataTypes.STRING(45),
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'sessions',
        timestamps: false
    });
};
