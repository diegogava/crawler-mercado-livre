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
		const returnRobot = Robot.search(params)
		.then(list => {
			/*console.log('Lista:');
			console.log(list);
			console.log('typeof list');
			console.log(typeof list);*/
			res.status(200).send(JSON.stringify(list));
		})
		.catch(error => {
			res.status(400).send("Something went wrong!");
		})
		/*console.log(`Return Robot:`);
		console.log(returnRobot);
		res.status(200).json(JSON.stringify(returnRobot));*/
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
