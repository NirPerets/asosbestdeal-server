const axios = require('axios');
const res = require('express/lib/response');
const fs = require('fs')

const fetchProduct = async (url) => {
    let product = {};
    let sizes = []
    await axios.get(url)
        .then((res) =>  {
            product.price = res.data.price.current.value
            product.name = res.data.name
            if(res.data.isInStock) {
                for(let j=0; j < res.data.variants.length; j++) {
                    if(res.data.variants[j].isInStock) {
                        sizes.push(res.data.variants[j].brandSize)
                    }
                }
            }

            product.sizes = sizes;
        })       
        .catch(err => {
            if(err) {
                product = {
                    sizes: "Product Not Available"
                }
            }
        })
    
    return product;
}

const fetchBag = async (bag) => {
    let finalResults = [];
    const ilsPrice = JSON.parse(fs.readFileSync('./ils.json'));
    for(let i=0; i < bag.length; i++) {
        let country = await fetchCountry(bag[i][Object.keys(bag[i])[0]], ilsPrice)
        finalResults.push(country)
    }
    await finalResults.sort((a,b) => (a.totalBagPrice > b.totalBagPrice) ? 1 : ((b.totalBagPrice > a.totalBagPrice) ? -1 : 0))
    return finalResults
}

const fetchCountry = async (country, ils) => {
    let fetchedCountry = {}
    let total = 0;

    fetchedCountry.country = country.country
    fetchedCountry.currency = country.currency
    fetchedCountry.code = country.code
    fetchedCountry.CountryCode = country.CountryCode

    fetchedCountry.products = []

    for(let i=0; i < country.urls.length; i++) {
        let pro = await fetchProduct(country.urls[i])
        total += pro.price
        fetchedCountry.products.push(pro)
    }

    fetchedCountry.totalBagPrice = (total / ils[country.currency]).toFixed(2)
    return fetchedCountry
}

const getProductImage = async (url) => {
    let product = {};
    await axios.get(url)
    .then((res) =>  {
        product.image = res.data.media.images[0]
        product.name = res.data.variants[0].name
    })       
    .catch(err => {
        if(err) {}
    })
    return product
}

module.exports.fetchProduct = fetchProduct;
module.exports.getProductImage = getProductImage;
module.exports.fetchBag = fetchBag;
module.exports.fetchCountry = fetchCountry;    