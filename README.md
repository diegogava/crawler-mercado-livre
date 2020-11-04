# Crawler Mercado Livre

Crawler (collector) capable of searching a list of products in 'Mercado Livre' plataform.

# Instructions

### Requirements

[Node.js](https://nodejs.org/) v10+ is required to run the project.

### Running

* Clone the project or extract the zipped file, and browse to the destination folder.
* Install the dependencies and run the server.


```sh
$ npm install
$ npm start
```

### Tests

While the server is running, make a POST request (according to the specification) at the endpoint http://localhost:3000/, being able to use software such as Postman, some browser, or even CURL, for example.

### Notes

If you are in a Linux environment and have puppeteer processes that have not been terminated for any reason, run the following command:

```sh
$ ps aux | awk '/puppeteer/ { print $2 } ' | xargs kill -9
```