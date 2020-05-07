const helper = require('../helpers/helper.js');
const puppeteer = require('puppeteer');

class Robot {
	async search(params) {
		let itemsResult = [];
		let itemsResultAux = [];
		let counterMax = 0;
		const search = params.search;
		const limit = params.limit;
		const maxIterations = 50;
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const url = "https://www.mercadolivre.com.br/";
		await page.goto(url);
		page.on('console', msg => {
			for (let i = 0; i < msg.args().length; i++) {
				console.log(`${i}: ${msg.args()[i]}`);
			}
		});
		const list = await page
			.waitForSelector("#nav-header-menu-switch")
			.then(async () => {
				return await page.click(".nav-search-input")
					.then(async () => {
						await page.type(".nav-search-input", search);
						await page.keyboard.press("Enter");
						await page.waitForNavigation();
						await page.click(".view-option-stack");
						return await page.waitForSelector("#searchResults")
							.then(async () => {
								while ((limit > itemsResult.length) && (counterMax < maxIterations)) {
									counterMax++;
									itemsResultAux = [];
									const itemName = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('main-title'));
										return items.map(item => {
											return item.innerText;
										});
									});
									const itemPrice = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__price'));
										return items.map(item => {
											const priceFraction = item.getElementsByClassName('price__fraction')[0];
											const priceDecimals = item.getElementsByClassName('price__decimals')[0];
											let price = null;
											if (priceFraction && priceDecimals) {
												price = priceFraction.innerText.replace('.', '')
													+ '.' + priceDecimals.innerText.replace('.', '');
											} else if (priceFraction) {
												price = priceFraction.innerText.replace('.', '');
											}
											return price;
										});
									});
									const itemStatus = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__condition'));
										return items.map(item => {
											return item.innerText;
										});
									});
									const itemLink = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__info-title'));
										return items.map(item => {
											return item.getAttribute('href');
										});
									});
									const itemStore = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__brand-title-tos'));
										return items.map(item => {
											const retorno = item.innerText.replace(
												/\s*por\s/g,
												''
											);
											return retorno;
										});
									});
									itemName.forEach(item => {
										itemsResultAux.push({name: item.toString()});
									});
									itemsResultAux.forEach((item, index) => {
										if (itemLink[index]) {
											item['link'] = itemLink[index].toString();;
										} else {
											item['link'] = null;
										}
										if (itemPrice[index]) {
											item['price'] = itemPrice[index].toString();;
										} else {
											item['price'] = null;
										}
										if (itemStore[index]) {
											item['store'] = itemStore[index].toString();;
										} else {
											item['store'] = null;
										}
										if (itemStatus[index]) {
											item['state'] = itemStatus[index];
										} else {
											item['state'] = null;
										}
									});
									if ((itemsResult.length + itemsResultAux.length) > limit) {
										itemsResultAux = itemsResultAux.slice(0, (limit - itemsResult.length));
									}
									itemsResult = itemsResult.concat(itemsResultAux);
									if (limit > itemsResult.length) {
										if (await page.$('a.andes-pagination__link.prefetch') !== null) {
											await page.click("a.andes-pagination__link.prefetch");
											await page.waitFor(1000);
										} else {
											break;
										}
									}
									if (itemsResultAux.length === 0) {
										break;
									}
								}
								if (limit < itemsResult.length) {
									itemsResult = itemsResult.slice(0, limit);
								}
								return itemsResult;
						});
				});
		})
		await browser.close();
		return list;
	}
}

module.exports = new Robot;