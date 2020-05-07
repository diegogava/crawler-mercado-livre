const helper = require('../helpers/helper.js');
const puppeteer = require('puppeteer');

class Crawler {
	async search(params) {
		let itemsResult = [];
		let itemsResultAux = [];
		let counterMax = 0;
		// Recupera os valores passados por parâmetro (serch e limit).
		const search = params.search;
		const limit = params.limit;
		const maxIterations = 50;
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const url = "https://www.mercadolivre.com.br/";
		await page.goto(url);
		// Caso seja necessário fazer um console.log em alguns comandos do puppeteer.
		page.on('console', msg => {
			for (let i = 0; i < msg.args().length; i++) {
				console.log(`${i}: ${msg.args()[i]}`);
			}
		});
		const list = await page
			.waitForSelector("#nav-header-menu-switch")
			.then(async () => {
				// Clica no input de procura presente na página inicial.
				return await page.click(".nav-search-input")
					.then(async () => {
						// Digita o texto a ser procurado e faz a navegação.
						await page.type(".nav-search-input", search);
						await page.keyboard.press("Enter");
						await page.waitForNavigation();
						// Altera a view para lista ao invés de cards, para facilitar a busca.
						await page.click(".view-option-stack");
						// Caso os resultados estejam presentes.
						return await page.waitForSelector("#searchResults")
							.then(async () => {
								// Enquanto não for preenchido o limite determinado pela requisição POST
								// realiza navegações e buscas e vai preenchendo o array de resultados.
								// Avalia também um limite máximo determinado, para caso o while não
								// termina de forma lógica.
								while ((limit > itemsResult.length) && (counterMax < maxIterations)) {
									counterMax++;
									itemsResultAux = [];
									// Recupera os nomes dos produtos.
									const itemName = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('main-title'));
										return items.map(item => {
											return item.innerText;
										});
									});
									// Recupera os preços dos produtos.
									const itemPrice = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__price'));
										return items.map(item => {
											// Faz a formatação do preço.
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
									// Recupera os estados dos produtos.
									const itemStatus = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__condition'));
										return items.map(item => {
											return item.innerText;
										});
									});
									// Recupera os links dos produtos.
									const itemLink = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__info-title'));
										return items.map(item => {
											return item.getAttribute('href');
										});
									});
									// Recupera as lojas dos produtos.
									const itemStore = await page.evaluate(() => {
										const items = Array.from(document.getElementsByClassName('item__brand-title-tos'));
										return items.map(item => {
											// Faz um tratamento para retirar a expressão 'por' do nome da loja.
											const retorno = item.innerText.replace(
												/\s*por\s/g,
												''
											);
											return retorno;
										});
									});
									// Guarda o array de nomes no array auxiliar de resultados.
									itemName.forEach(item => {
										itemsResultAux.push({name: item.toString()});
									});
									// Guarda o array dos outros atributos no array auxiliar de resultados.
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
									// Caso o número de itens guardados no array total de resultados
									// somado com o array auxiliar ultrapasse o limite, então faz
									// uma redução no array auxiliar, para que assim o array final
									// não ultrapasse o limite.
									if ((itemsResult.length + itemsResultAux.length) > limit) {
										itemsResultAux = itemsResultAux.slice(0, (limit - itemsResult.length));
									}
									// Concatena o array auxiliar no array final.
									itemsResult = itemsResult.concat(itemsResultAux);
									// Se ainda não ultrapassou o limite passado pelo usuário, então
									// continua a navegação para as próximas páginas.
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
								// Realiza uma última verificação para que o array final de
								// resultados não tenha ultrapassado o limite.
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

module.exports = new Crawler;