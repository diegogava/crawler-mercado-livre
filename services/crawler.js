const helper = require('../helpers/helper.js')
const puppeteer = require('puppeteer')

class Crawler {
	async search(params) {
		let itemsResult = []
		let itemsResultAux = []
		let counterMax = 0
		// Retrieves the values ​​passed by parameter (search and limit).
		const search = params.search
		const limit = params.limit
		const maxIterations = 50
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		const url = 'https://www.mercadolivre.com.br/'
		await page.goto(url)
		// If it is necessary to make a console.log in some puppeteer commands.
		page.on('console', msg => {
			for (let i = 0; i < msg.args().length; i++) {
				console.log(`${i}: ${msg.args()[i]}`)
			}
		})
		const list = await page
			.waitForSelector("#nav-header-menu-switch")
			.then(async () => {
				// Click on the search input on the home page.
				return await page.click(".nav-search-input")
					.then(async () => {
						// Type the text to be searched and browse.
						await page.type(".nav-search-input", search)
						await page.keyboard.press("Enter")
						await page.waitForNavigation()
						// Changes the view to list instead of cards, for easy searching.
						await page.click(".view-option-stack")
						// If the results are present.
                        return await page.waitForSelector("#searchResults")
							.then(async () => {
                                // As long as the limit determined by POST request is not met,
                                // performs searches and searches and fills the results array.
                                // It also evaluates a determined maximum limit, in case the 'while'
                                // does not ends logically.
								while ((limit > itemsResult.length) && (counterMax < maxIterations)) {
									counterMax++
									itemsResultAux = []
									// Retrieve product names
									const itemName = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('main-title'))
										return items.map(item => {
											return item.innerText
										})
									})
									// Retrieve product prices
									const itemPrice = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__price'))
										return items.map(item => {
											// Format the price
											const priceFraction = item.getElementsByClassName('price__fraction')[0]
											const priceDecimals = item.getElementsByClassName('price__decimals')[0]
											let price = null
											if (priceFraction && priceDecimals) {
												price = priceFraction.innerText.replace('.', '') +
                                                    '.' + priceDecimals.innerText.replace('.', '')
											} else if (priceFraction) {
												price = priceFraction.innerText.replace('.', '')
											}
											return price
										})
									})
									// Recovers product states.
									const itemStatus = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__condition'))
										return items.map(item => {
											return item.innerText
										})
									})
									// Recovers product links.
									const itemLink = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__info-title'))
										return items.map(item => {
											return item.getAttribute('href')
										})
									})
                                    // Recovers product stores.
									const itemStore = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__brand-title-tos'))
										return items.map(item => {
											// Remove the expression 'por' from the store name.
											const retorno = item.innerText.replace(
												/\s*por\s/g,
												''
											)
											return retorno
										})
									})
                                    // Stores the array of names in the auxiliary result array.
									itemName.forEach(item => {
										itemsResultAux.push({name: item.toString()})
									})
                                    // Stores the array of other attributes in the auxiliary result array.
									itemsResultAux.forEach((item, index) => {
										if (itemLink.index) {
											item.link = itemLink.index.toString()
										} else {
											item.link = null
										}
										if (itemPrice.index) {
											item.price = itemPrice.index.toString()
										} else {
											item.price = null
										}
										if (itemStore.index) {
											item.store = itemStore.index.toString()
										} else {
											item.store = null
										}
										if (itemStatus.index) {
											item.state = itemStatus.index
										} else {
											item.state = null
										}
									})
                                    // In the number of items saved in the total result array added with
                                    // the auxilliary array exceeds the limit, then does a reduction in
                                    // the auxiliary array, so that the final array do not exceed the limit.
									if ((itemsResult.length + itemsResultAux.length) > limit) {
										itemsResultAux = itemsResultAux.slice(0, (limit - itemsResult.length))
									}
                                    // Concatenates the auxiliary array to the final array.
									itemsResult = itemsResult.concat(itemsResultAux)
									// If not crossed the limite passed by the user yet,
                                    // then continue to the next pages
									if (limit > itemsResult.length) {
										if (await page.$('a.andes-pagination__link.prefetch') !== null) {
											await page.click("a.andes-pagination__link.prefetch")
											await page.waitFor(1000)
										} else {
											break
										}
									}
									if (itemsResultAux.length === 0) {
										break
									}
								}
								// Performs a final check so that the final array
                                // of results have not exceeded the limit.
                                if (limit < itemsResult.length) {
									itemsResult = itemsResult.slice(0, limit)
								}
								return itemsResult
						})
				})
		})
		await browser.close()
		return list
	}
}

module.exports = new Crawler()