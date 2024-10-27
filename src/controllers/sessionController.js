const { Session, GeoLocation } = require('../models');

exports.logSession = async (req, res, next) => {
  try {
    const ip = await getClientIp(req);

    // Simulating getting geolocation details from IP address
    const geoLocation = await getGeoLocationFromIP(ip);

    const sessionData = {
      user_id: (await req.cache.getUser(req.body.user)).user_id,
      page_id: (await req.cache.getPage(req.body.pageUrl)).page_id,
      browser_id: (await req.cache.getBrowser(req.body.browser)).browser_id,
      os_id: (await req.cache.getOperatingSystem(req.body.operatingSystem)).os_id,
      device_type_id: (await req.cache.getDeviceType(req.body.deviceType)).device_type_id,
      geo_id: (await req.cache.getGeoLocation(geoLocation.country, geoLocation.region, geoLocation.city)).geo_id,
      ip_address: ip,
      start_time: new Date(),
    };
    console.log(sessionData);
    const session = await Session.create(sessionData);

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

async function getClientIp(req) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

  // If the IP is IPv6-mapped IPv4, convert it to the IPv4 format
  if (ip.startsWith('::ffff:')) {
    ip = ip.split('::ffff:')[1];
  }

  return ip;
}

async function getGeoLocationFromIP(ip) {
  // This function randomly returns a GeoLocation record from DB. In production, we will implement mechanism
  // that will retrieve geo-location data based on the IP address of the calling client.
  try {
    return await GeoLocation.findOne({
      offset: Math.floor(Math.random() * 10)
    });
  } catch (error) {
    console.error('Error fetching random geolocation:', error);
    throw error;
  }
}