const logger = require('../services/logger.js');
const Crawler = require('../services/crawler.js');

module.exports = (app) => {
	app.post('/', (req, res) => {
		// Recupera os parâmetros enviados via POST e os guarda em um objeto.
		const search = req.body["search"];
		const limit = req.body["limit"];
		const params = {
			search: search,
			limit: limit
		}
		// Chama o serviço de Crawler para fazer a busca na plataforma Mercado Livre.
		const returnCrawler = Crawler.search(params)
			.then(list => {
				//console.log('OK');
				res.status(200).send(JSON.stringify(list));
			})
			.catch(error => {
				/*console.log('Erro:');
				console.log(error);*/
				const errorMsg = {
					"error":"error",
					"message":"Something went wrong!"
				};
				res.status(400).send(JSON.stringify(errorMsg));
			})
	});
	// Middleware para o tratamento de erros na requisição POST.
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
