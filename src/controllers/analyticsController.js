const { Op } = require('sequelize');
const { Page, Session, sequelize } = require('../models');

// Fetch all unique domains from the page_url column
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

// Fetch visits filtered by domain and date range
exports.getVisitsByDate = async (req, res) => {
    const { startDate, endDate, domain } = req.query;

    try {
        // Raw SQL query to fetch page views by domain and date range
        const [results, metadata] = await sequelize.query(`
      SELECT p.page_url, pv.date, pv.hour, pv.views
      FROM page_views_aggregate pv
      JOIN pages p ON pv.page_id = p.page_id
      WHERE p.page_url LIKE :domain
      AND pv.date BETWEEN :startDate AND :endDate
      ORDER BY pv.date, pv.hour
    `, {
            replacements: {
                domain: `%${domain}%`,  // Allowing partial matches for the domain
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
      JOIN pages p ON s.page_id = p.page_id  -- Join with pages to get page_url
      JOIN browsers b ON s.browser_id = b.browser_id  -- Join with browsers to get browser_name
      WHERE p.page_url LIKE :domain  -- Use LIKE to filter by domain in page_url
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
      JOIN pages p ON s.page_id = p.page_id  -- Join with pages to get page_url
      JOIN device_types dt ON s.device_type_id = dt.device_type_id  -- Join with device_types to get device_type
      WHERE p.page_url LIKE :domain  -- Use LIKE to filter by domain in page_url
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

