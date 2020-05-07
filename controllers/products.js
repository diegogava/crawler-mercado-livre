const logger = require('../services/logger.js');
const Robot = require('../services/robot.js');

module.exports = (app) => {
	app.post('/', (req, res) => {
		const search = req.body["search"];
		const limit = req.body["limit"];
		/*console.log(search);
		console.log(limit);*/
		const params = {
			search: search,
			limit: limit
		}
		const returnRobot = Robot.search(params).then((value) => {
			console.log(value)
		});
		console.log(`Return Robot:`);
		console.log(returnRobot);
		res.send('OK');
	});

	app.use((req, res, next) => {
		const error = new Error("Not found");
		error.status = 404;
		next(error);
	});

	// Middleware para o tratamento de erros no servidor.
	app.use((error, req, res, next) => {
		res.status(error.status || 500).send({
			error: {
				status: error.status || 500,
				message: error.message || 'Internal Server Error',
			},
		});
	});
}
