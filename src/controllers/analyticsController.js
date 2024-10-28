const { Page, sequelize } = require('../models');

exports.getAllDomains = async (req, res) => {
    try {
        // Use Sequelize to extract distinct domains from page_url
        const pages = await Page.findAll({
            attributes: [
                [sequelize.fn('SUBSTRING_INDEX', sequelize.col('page_url'), '/', 3), 'domain']
            ],
            group: ['domain'],  // Group by domain to ensure uniqueness
        });

        // Extract and map domain names
        const domains = pages.map(page => page.get('domain'));
        res.status(200).json(domains);
    } catch (err) {
        console.error('Error fetching domains:', err);
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
};

exports.getVisitsByDate = async (req, res) => {
    const { startDate, endDate, domain } = req.query;

    try {
        const [results] = await sequelize.query(`
          SELECT 
            p.page_url,
            DATE(s.start_time) AS date,
            HOUR(s.start_time) AS hour,
            COUNT(s.session_id) AS views
          FROM sessions s
          JOIN pages p ON s.page_id = p.page_id
          WHERE p.page_url LIKE :domain
          AND DATE(s.start_time) BETWEEN :startDate AND :endDate
          GROUP BY p.page_url, date, hour
          ORDER BY date, hour
        `, {
            replacements: {
                domain: `%${domain}%`,
                startDate,
                endDate
            }
        });

        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching visits by date:', err);
        res.status(500).json({ error: 'Failed to fetch visits' });
    }
};


exports.getBrowserStats = async (req, res) => {
    const { domain, startDate, endDate } = req.query;

    try {
        const browserStats = await sequelize.query(
            `
            SELECT b.browser_name AS browser, COUNT(s.browser_id) AS views
            FROM sessions s
            JOIN pages p ON s.page_id = p.page_id
            JOIN browsers b ON s.browser_id = b.browser_id
            WHERE p.page_url LIKE :domain
            AND s.start_time BETWEEN :startDate AND :endDate
            GROUP BY b.browser_name
            `,
            {
                replacements: { domain: `%${domain}%`, startDate, endDate },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const response = {};
        browserStats.forEach(stat => {
            response[stat.browser] = stat.views;
        });

        res.status(200).json(response);
    } catch (err) {
        console.error('Error fetching browser stats:', err);
        res.status(500).json({ error: 'Failed to fetch browser stats' });
    }
};

exports.getDeviceStats = async (req, res) => {
    const { domain, startDate, endDate } = req.query;

    try {
        const deviceStats = await sequelize.query(
            `
            SELECT dt.device_type AS device_type, COUNT(s.device_type_id) AS views
            FROM sessions s
            JOIN pages p ON s.page_id = p.page_id
            JOIN device_types dt ON s.device_type_id = dt.device_type_id
            WHERE p.page_url LIKE :domain
            AND s.start_time BETWEEN :startDate AND :endDate
            GROUP BY dt.device_type
            `,
            {
                replacements: { domain: `%${domain}%`, startDate, endDate },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const response = {};
        deviceStats.forEach(stat => {
            response[stat.device_type] = stat.views;
        });

        res.status(200).json(response);
    } catch (err) {
        console.error('Error fetching device stats:', err);
        res.status(500).json({ error: 'Failed to fetch device stats' });
    }
};

