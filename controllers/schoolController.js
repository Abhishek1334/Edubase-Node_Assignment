const pool = require("../db/connection");

// Haversine formula to calculate distance between two geo points in km
function getDistance(lat1, lon1, lat2, lon2) {
	const R = 6371; // Earth's radius in km
	const toRad = (deg) => (deg * Math.PI) / 180;

	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

const addSchool = async (req, res) => {
	const { name, address, latitude, longitude } = req.body;

	// Validate inputs
	if (!name || !address || latitude == null || longitude == null) {
		return res
			.status(400)
			.json({
				error: "All fields (name, address, latitude, longitude) are required.",
			});
	}

	if (isNaN(latitude) || isNaN(longitude)) {
		return res
			.status(400)
			.json({ error: "Latitude and longitude must be valid numbers." });
	}

	try {
		const sql = `
			INSERT INTO schools (name, address, latitude, longitude)
			VALUES (?, ?, ?, ?)
		`;

		await pool.execute(sql, [
			name,
			address,
			parseFloat(latitude),
			parseFloat(longitude),
		]);

		res.status(201).json({ message: "School added successfully." });
	} catch (err) {
		console.error("Error in addSchool:", err.message);
		res.status(500).json({
			error: "Failed to add school. Please try again later.",
		});
	}
};

const listSchools = async (req, res) => {
	const { latitude, longitude } = req.query;

	if (!latitude || !longitude) {
		return res
			.status(400)
			.json({
				error: "Query parameters 'latitude' and 'longitude' are required.",
			});
	}

	const userLat = parseFloat(latitude);
	const userLon = parseFloat(longitude);

	if (isNaN(userLat) || isNaN(userLon)) {
		return res
			.status(400)
			.json({ error: "Latitude and longitude must be valid numbers." });
	}

	try {
		const [schools] = await pool.query("SELECT * FROM schools");

		const schoolsWithDistance = schools.map((school) => ({
			...school,
			distance_km: getDistance(
				userLat,
				userLon,
				school.latitude,
				school.longitude
			).toFixed(2),
		}));

		schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

		res.json(schoolsWithDistance);
	} catch (err) {
		console.error("Error in listSchools:", err.message);
		res.status(500).json({
			error: "Failed to fetch schools. Please try again later.",
		});
	}
};

module.exports = { addSchool, listSchools };