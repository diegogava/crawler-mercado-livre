const puppeteer = require('puppeteer');
(async () =>
{
	const search = 'computador';
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	let url = "https://www.mercadolivre.com.br/";
	console.log(`Fetching page data for : ${url}...`);
	//await page.setRequestInterception(true);
  /*page.on("request", request => {
	const url = request.url();
	//console.log("request url:", url);
	request.continue();
  });
  page.on("requestfailed", request => {
	const url = request.url();
   // console.log("request failed url:", url);
  });*/
	await page.goto(url);
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

					await page.click(".view-option-stack");

					console.log('New Page URL:', page.url());





					page.on('console', msg => {
						for (let i = 0; i < msg.args().length; ++i)
						  console.log(`${i}: ${msg.args()[i]}`);
					  });

					  await page.waitForSelector("#searchResults")
						.then(async () => {

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
										price = priceFraction.innerText + '.' + priceDecimals.innerText;
									} else if (priceFraction) {
										price = priceFraction.innerText;
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
									console.log('item sem por');
									console.log(retorno);
									return retorno;
								});
							});
							console.log('itemLink:');
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
							console.log(`Total items store: ${itemStore.length}`);
							//console.log(`Got ${data.length} records`);
					});
					//await page.screenshot({path: 'domain.png'});
			});
			return result;
	})
	await browser.close();
})();
