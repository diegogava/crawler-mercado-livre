const puppeteer = require('puppeteer');
(async () =>
{
	const search = 'computador';
	//const limit = 120;
	const limit = 100;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	let url = "https://www.mercadolivre.com.br/";
	let list = {};
	let itemsResult = [];
	let itemsResultAux = [];
	let counterMax = 0;
	const maxIterations = 50;
	await page.goto(url);
	page.on('console', msg => {
		for (let i = 0; i < msg.args().length; ++i) {
			console.log(`${i}: ${msg.args()[i]}`);
		}
	});
	list = await page
		.waitForSelector("#nav-header-menu-switch")
		.then(async () => {
			return await page.click(".nav-search-input")
				.then(async () => {
					await page.type(".nav-search-input", search);
					await page.keyboard.press("Enter");
					await page.waitForNavigation();
					//console.log('New Page URL:', page.url());
					await page.click(".view-option-stack");
					//console.log('New Page URL:', page.url());
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
											price = priceFraction.innerText.replace('.', '') + '.' + priceDecimals.innerText.replace('.', '');
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
								console.log('itemName.length:')
								console.log(itemName.length)
								itemName.forEach(item => {
									itemsResultAux.push({name: item.toString()});
								});
								itemsResultAux.forEach((item, index) => {
									if (itemLink[index]) {
										//item.push({link: itemLink[index].toString()});
										item['link'] = itemLink[index].toString();
									} else {
										//item.push({link: null});
										item['link'] = null;
									}
									if (itemPrice[index]) {
										//item.push({price: itemPrice[index].toString()});
										item['price'] = itemPrice[index].toString();
									} else {
										//item.push({price: null});
										item['price'] = null;
									}
									if (itemStore[index]) {
										//item.push({store: itemStore[index].toString()});
										item['store'] = itemStore[index].toString();
									} else {
										//item.push({store: null});
										item['store'] = null;
									}
									if (itemStatus[index]) {
										//item.push({state: itemStatus[index].toString()});
										item['state'] = itemStatus[index].toString();
									} else {
										//item.push({state: null});
										item['state'] = null;
									}
								});


								if ((itemsResult.length + itemsResultAux.length) > limit) {
									console.log('Ultrapassou o limite!');
									console.log('Novo tamanho: ');
									console.log(limit - itemsResult.length);
									itemsResultAux = itemsResultAux.slice(0, (limit - itemsResult.length));
								}

								itemsResult = itemsResult.concat(itemsResultAux);
								console.log('limit:');
								console.log(limit);
								console.log('itemsResultAux.length:');
								console.log(itemsResultAux.length);
								console.log('itemsResult.length:');
								console.log(itemsResult.length);

								if (limit > itemsResult.length) {

									if (await page.$('a.andes-pagination__link.prefetch') !== null) {
										console.log('ENCONTRADO');
										await page.click("a.andes-pagination__link.prefetch");
										console.log('New Page URL:', page.url());
										await page.waitFor(1000);
										await page.screenshot({path: 'domain.png'});
										//await page.click(".view-option-stack");
									} else {
										console.log('NÃO ENCONTRADO');
										break;
									}
								}
								if (itemsResultAux.length === 0) {
									break;
								}
							}



							/*console.log('itemsResult');
							console.log(itemsResult);*/
							if (limit < itemsResult.length) {
								itemsResult = itemsResult.slice(0, limit);
							}
							/*console.log('itemsResult.length (DEPOIS):');
							console.log(itemsResult.length);*/

							await page.screenshot({path: 'domain.png'});
							return itemsResult;
							//console.log(`Got ${data.length} records`);
					});

			});
			//return result;
	})
	//list = JSON.stringify(list);
	/*console.log('Lista Final:');
	console.log(list);*/
	await browser.close();
})();
