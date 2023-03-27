const express    = require('express');
const bodyParser = require('body-parser');
const axios      = require('axios');
const fs         = require('fs')
const cron       = require('node-cron')
const path       = require('path')
const urlBuilder   = require('./Functions/getUrls')
const fetchProduct = require('./Functions/fetchProducts');

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/getImage", async (req,res) => {
    const url = await urlBuilder.getCustomUrl(req.body.url,"COM","GBP") // Get UK Url
    const product = await fetchProduct.getProductImage(url);
    res.send(product);
})

app.post('/bulkFetch', async(req,res) => {
    urlBuilder.buildAllCountriesUrls(req.body.products)
        .then(allUrls => fetchProduct.fetchBag(allUrls))
        .then(response => res.send(response));
})

app.post('/getIls', (req, res) => {
    const ilsPrice = JSON.parse(fs.readFileSync('./ils.json'));
    res.send({ ils : ilsPrice })
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})

function setIlsPrice() {
    axios.get('https://v6.exchangerate-api.com/v6/90cfe31901cd0d8ddb38358d/latest/ILS').then(response => {
        fs.truncate('/ils.json', 0 , () => {})
        fs.writeFile('ils.json', JSON.stringify(response.data.conversion_rates), (err) => {  
            if(err) {console.log(err)}
            else {console.log('Updated ILS')}
        })
    });
}

cron.schedule('0 0 * * *', () => {
    setIlsPrice()
})

app.use(express.static(path.resolve(__dirname, "./client/build")));
