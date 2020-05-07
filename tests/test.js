const puppeteer = require('puppeteer');
(async () =>
{
	const search = 'computador';
	//const limit = 120;
	const limit = 10;
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
					console.log('New Page URL:', page.url());
					await page.click(".view-option-stack");
					console.log('New Page URL:', page.url());
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
										/*console.log('item.innerHTML');
										console.log(item.innerHTML);
										console.log('priceFraction.innerHTML');
										console.log(priceFraction.innerHTML);*/
										/*console.log(JSON.stringify(priceDecimals));*/
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
										/*console.log('item sem por');
										console.log(retorno);*/
										return retorno;
									});
								});
								/*console.log('itemLink:');
								console.log(itemLink);
								console.log('itemName:');
								console.log(itemName);
								console.log('itemPrice:');
								console.log(itemPrice);
								console.log('itemStatus:');
								console.log(itemStatus);
								console.log('itemStore:');
								console.log(itemStore);
								console.log(`Total items links: ${itemLink.length}`);
								console.log(`Total items name: ${itemName.length}`);
								console.log(`Total items price: ${itemPrice.length}`);
								console.log(`Total items state: ${itemStatus.length}`);
								console.log(`Total items store: ${itemStore.length}`);*/

								itemName.forEach(item => {
									//itemsResult[] = {};
									itemsResultAux.push({name: item.toString()});
									//count++;
								});
								/*console.log('itemsResult:');
								console.log(itemsResult);
								console.log('typeof itemsResult:');
								console.log(typeof itemsResult);*/
								itemsResultAux.forEach((item, index) => {
									if (itemLink[index]) {
										item['link'] = itemLink[index].toString();
									} else {
										item['link'] = null;
									}
									if (itemPrice[index]) {
										item['price'] = itemLink[index].toString();
									} else {
										item['price'] = null;
									}
									if (itemStore[index]) {
										item['store'] = itemStore[index].toString();
									} else {
										item['store'] = null;
									}
									if (itemStatus[index]) {
										item['state'] = itemStatus[index].toString();
									} else {
										item['state'] = null;
									}
									//item = JSON.stringify(item);
								});


								if ((itemsResult.length + itemsResultAux.length) > limit) {
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
										//console.log('ENCONTRADO');
										await page.click("a.andes-pagination__link.prefetch");
										//console.log('New Page URL:', page.url());
										//await page.screenshot({path: 'domain.png'});
										//await page.click(".view-option-stack");
									} else {
										console.log('NÃO ENCONTRADO');
										break;
									}

								}
							}



							/*console.log('itemsResult');
							console.log(itemsResult);*/
							if (limit < itemsResult.length) {
								itemsResult = itemsResult.slice(0, limit);
							}
							/*console.log('itemsResult.length (DEPOIS):');
							console.log(itemsResult.length);*/


							return itemsResult;
							//console.log(`Got ${data.length} records`);
					});
					//await page.screenshot({path: 'domain.png'});
			});
			//return result;
	})
	/*list = JSON.stringify(list);
	console.log('Lista Final:');
	console.log(list);*/
	await browser.close();
})();
