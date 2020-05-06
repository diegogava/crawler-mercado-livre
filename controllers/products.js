const logger = require('../services/logger.js');

module.exports = (app) => {
	app.post('/', (req, res) => {
		const search = req.body["search"];
		const limit = req.body["limit"];
		console.log(search);
		console.log(limit);
		res.send('OK');
	});
}
