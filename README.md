# Crawler Mercado Livre
Crawler (coletor) capaz de buscar uma lista de produtos no Mercado Livre.

# Instruções

### Requisitos

É requerido [Node.js](https://nodejs.org/) v10+ para executar.

### Execução

* Clone o projeto ou extraia o arquivo zipado, e navegue até a pasta destino.
* Instale as dependências e execute o servidor.

```sh
$ npm install
$ npm start
```

### Testes

Enquanto o servidor estiver rodando, faça uma requisição POST (de acordo com a especificação) no endpoint http://localhost:3000/, podendo utilizar softwares como Postman, algum navegador, ou mesmo CURL, por exemplo.

### Observações

Caso esteja em um ambiente Linux e tenha processos do puppeteer que não foram finalizados por algum motivo, execute o seguinte comando:
```sh
$ ps aux | awk '/puppeteer/ { print $2 } ' | xargs kill -9
```