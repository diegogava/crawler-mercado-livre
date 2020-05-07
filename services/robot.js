const axios = require('axios');
const chromium = require('chrome-aws-lambda');
const helper = require('../helpers/helper.js');
const puppeteer = require('puppeteer');
const url = "https://www.mercadolivre.com.br/";

class Robot {
	async search(params) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const search = params.search;
		const limit = params.limit;
		console.log('search');
		console.log(search);
		console.log('limit');
		console.log(limit);
		await page.goto('https://www.mercadolivre.com.br/')
		.then(async () => {
			console.log('oi');
			let result = await page.evaluate(() => {
				return document.querySelector(".payment-data-title").innerText;
			  });
			console.log(result);
			return await page
				.waitForSelector("#nav-header-menu-switch")
				.then(async () => {

					await page.click(".nav-search-input")
						.then(async () => {

							await page.type(".nav-search-input", search);
							await page.keyboard.press("Enter");
							await page.waitForNavigation();

							console.log('New Page URL:', page.url());
							const searchResults = await page.evaluate(() => {
								return document.querySelector("#searchResults");
							});
							console.log('Search Results:');
							console.log(searchResults);

					});
					return result;
			})
		})
		.catch(error => {
			console.log('Deu erro');
		})
		// Configure the navigation timeout
		/*await page.goto('https://google.com', {
			waitUntil: 'load'
		})
		.then(async () => {
			console.log('oi')
		})
		console.log('iooioi');*/
		await browser.close();
	}
}

module.exports = new Robot;