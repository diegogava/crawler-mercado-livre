const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const logger = require('../services/logger')

module.exports = () => {
	const app = express()
	app.use(morgan("common", {
		stream: {
			write: function(mensagem) {
				logger.info(mensagem)
			}
		}
	}))
	app.use(bodyParser.urlencoded({extended: true}))
	app.use(bodyParser.json())
	consign()
		.include('controllers')
		.then('services')
		.into(app)
	return app
}