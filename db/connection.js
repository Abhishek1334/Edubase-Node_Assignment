const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

pool.getConnection()
	.then((conn) => {
		console.log("DB connection successful");
		conn.release();
	})
	.catch((err) => {
		console.error("DB connection failed:", err);
	});


module.exports = pool;
