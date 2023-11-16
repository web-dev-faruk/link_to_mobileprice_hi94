const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to serve the HTML form
app.get('/scrape', (req, res) => {
  const htmlForm = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Scraping Form</title>
    </head>
    <body>
      <h1>Scraping Form</h1>
      <form action="/scrape" method="post">
        <label for="urlInput">Enter URL to scrape:</label><br>
        <input type="text" id="urlInput" name="url"><br><br>
        <button type="submit">Scrape Data</button>
      </form>
    </body>
    </html>
  `;

  res.send(htmlForm);
});

// Route to handle the form submission and perform scraping
app.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).send('URL is required');
    }
    const allPricesArray=[];
    const countryArray=[`au`,`bd`,`cn`, `in`, `indonesia`, `my`, `ng`, `pk`, `ae`, `us`];
    for (let index = 1; index <= 10; index++) {


        if (countryArray[index-1] !==`indonesia`) {
            
            const modifiedURL= url.split(`hi94.com`).join(`hi94.com/${countryArray[index-1]}`);
            const response = await axios.get(modifiedURL);
            const html = response.data;
        
            // Load HTML content into Cheerio
            const $ = cheerio.load(html);
        
            // Your scraping logic here...
            // Example: scraping title from the webpage
            const priceOne = [];
            $('#box > div:nth-child(3)').each((index, element) => {
                priceOne.push($(element).text());
            });
        
            const priceTwo = [];
            $('#box > div:nth-child(4)').each((index, element) => {
                priceTwo.push($(element).text());
            });
    
            allPricesArray.push(`${priceOne.toString().split(`:`).join(``)}<br> ${priceTwo.toString().split(`:`).join(``)}<br><br>`);
            console.log(index);

        } else if(countryArray[index-1] ==`indonesia`){
            allPricesArray.push(`Check Indonesia mobile price from <a href="https://id.mobgsm.com/">mobgsm</a><br><br>`);

        }



        
    }

    
        const allPricesArrayCommaDelete= allPricesArray.toString().split(`,`).join(``);
        const allPricesArrayFirstBraket= allPricesArrayCommaDelete;
        const allPricesArrayColonReplace= allPricesArrayFirstBraket;

        res.setHeader("Content-Type", "text/html");
        res.send(`<p>${allPricesArrayColonReplace}</p><script>document.get<script>`);
        console.log(allPricesArrayColonReplace);
        
    
  } catch (error) {
    res.status(500).send('Error occurred during scraping');
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
