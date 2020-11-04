const logger = require('../services/logger')
const Crawler = require('../services/crawler')
const Response = require('../utils/response')

module.exports = app => {
	app.post('/', (req, res) => {
        // Save the parameters sent by POST
		const params = {
			search: req.body.search || null,
			limit: req.body.limit || null
		}
		// Call crawler to scrap on 'Mercado Livre'
		const returnCrawler = Crawler.search(params)
			.then(list => {
				//console.log('OK')
				res.status(200).send(JSON.stringify(list))
			})
			.catch(error => {
				console.log(error)
				const errorMsg = {
					error: 'error',
					message: 'Something went wrong!'
				}
				res.status(400).send(JSON.stringify(errorMsg))
			})
	})
	// Middleware for handling errors in the POST request.
	app.use((req, res, next) => {
		const error = new Error('Not found')
		error.status = 404
		next(error)
	})
	// Middleware for handling errors on the server.
	app.use((error, req, res, next) => {
		res.status(error.status || 500).send({
			error: {
				status: error.status || 500,
				message: error.message || 'Internal Server Error',
			},
		})
	})
}
