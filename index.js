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
    const countryArray=[`au`,`bd`, `ca`,`cn`, `in`, `my`, `ng`, `pk`, `ae`, `us`];
    for (let index = 1; index <= 10; index++) {
            
            const modifiedURL= url.split(`hi94.com`).join(`hi94.com/${countryArray[index-1]}`);
            const response = await axios.get(modifiedURL);
            const html = response.data;
        
            // Load HTML content into Cheerio
            const $ = cheerio.load(html);
        
            // Your scraping logic here...
            // Example: scraping title from the webpage
            const priceStart = [];
            $('#box > div:nth-child(2)').each((index, element) => {
                priceStart.push($(element).text());
            });
          
            const priceOne = [];
            $('#box > div:nth-child(3)').each((index, element) => {
                priceOne.push($(element).text());
            });
        
            const priceTwo = [];
            $('#box > div:nth-child(4)').each((index, element) => {
                priceTwo.push($(element).text());
            });
    
            allPricesArray.push(`${priceStart}<br> ${priceOne}<br> ${priceTwo}`);
            console.log(index);

    }
    // add html code
    const withStyle=`<html>
    <head>
        <style>
            #productPrices{
                width: 100%;
                max-width: 100%;
                margin-left: auto;
                margin-right: auto;
            }
    
            #productPrices details{
                margin: 0;
            }
            #productPrices details div {
                border: 0px solid #cecece;
                padding: 10px;
                letter-spacing: .5px;
                font-family: sans-serif;
                font-weight: 300;
                font-size: 14px;
                color: rgb(50, 50, 50);
                background-color: rgb(245, 245, 245);
            }
            #productPrices summary {
                list-style: none;
                font-family:Calibri;
                font-weight: 400;
                letter-spacing: 1px;
                font-size: 18px;
                color: rgb(139, 20, 106);
                background-color: rgb(255, 255, 255);
            }
    
            #productPrices summary::-webkit-details-marker {
                display: none;
            }
    
            #productPrices summary {
                border: .5px solid #cecece;
                padding: 5px;
                cursor: pointer;
                position: relative;
                padding-left: calc(1.75rem + .75rem + .75rem);
            }
    
            #productPrices summary:before {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: .75rem;
                content: "↓";
                width: 1.2rem;
                height: 1.2rem;
                background-color: #5ab1c0;
                color: #FFF;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
            }
    
            #productPrices details[open] summary {
                background-color: #ffffff;
            }
    
            #productPrices details[open] summary:before {
                content: "↑";
            }
    
            #productPrices summary:hover {
                background-color: #ffffff;
            }
        </style>
    </head>
    <body>
        <div id="productPrices">
            <details open>
                <summary>
                    Australia
                </summary>
                <div>
                    ${allPricesArray[0]}
                </div>
            </details>
            <details>
                <summary>
                    Bangladesh
                </summary>
                <div>
                  ${allPricesArray[1]}
                </div>
            </details>
            <details>
                <summary>
                    Canada
                </summary>
                <div>
                    ${allPricesArray[2]}
                </div>
            </details>
            <details>
                <summary>
                    China
                </summary>
                <div>
                    ${allPricesArray[3]}
                </div>
            </details>
            <details>
                <summary>
                    India
                </summary>
                <div>
                    ${allPricesArray[4]}
                </div>
            </details>
            <details>
                <summary>
                    Malaysia
                </summary>
                <div>
                    ${allPricesArray[5]}
                </div>
            </details>
            <details>
                <summary>
                    Nigeria
                </summary>
                <div>
                    ${allPricesArray[6]}
                </div>
            </details>
            <details>
                <summary>
                    Pakistan
                </summary>
                <div>
                    ${allPricesArray[7]}
                </div>
            </details>
            <details>
                <summary>
                    UAE
                </summary>
                <div>
                    ${allPricesArray[8]}
                </div>
            </details>
            
            <details>
                <summary>
                    USA
                </summary>
                <div>
                    ${allPricesArray[9]}
                </div>
            </details>
        </div>
    </body>
    </html>`;


    
        const allPricesArrayCommaDelete= allPricesArray.toString().split(`,`).join(``);
        const allPricesArrayFirstBraket= allPricesArrayCommaDelete;
        const allPricesArrayColonReplace= allPricesArrayFirstBraket;

        res.setHeader("Content-Type", "text/html");
        res.send(`<xmp>${withStyle}</xmp>`);
        console.log(withStyle);
        
    
  } catch (error) {
    res.status(500).send('Error occurred during scraping');
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
