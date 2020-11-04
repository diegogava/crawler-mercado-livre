const winston = require('winston');
const fs = require('fs');
// If the logs folder doesn't exist, create one.
if (!fs.existsSync('logs')) {
	fs.mkdirSync('logs');
}
module.exports = new winston.Logger({
	transports: [
		new winston.transports.File({
			level: "info",
			filename: "logs/crawler-log.log",
			maxsize: 100000,
			maxFiles: 10
		})
	]
});