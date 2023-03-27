const baseUrl = 'https://api.asos.com/product/catalogue/v3/products/'

const countries = [
    { code: "US", currency: "USD", country: "United States" }, 
    { code: "COM", currency: "GBP", country: "United Kingdom" }, 
    { code: "DK", currency: "GBP", country: "Denmark" },
    { code: "PL", currency: "GBP", country: "Poland" },
    { code: "SE", currency: "GBP", country: "Sweden" }, 
    { code: "DE", currency: "EUR", country: "Germany" }, 
    { code: "FR", currency: "EUR", country: "France" }, 
    { code: "ES", currency: "EUR", country: "Spain" }, 
    { code: "NL", currency: "EUR", country: "Netherlands" }, 
    { code: "IT", currency: "EUR", country: "Italy" },
    { code: "AU", currency: "AUD", country: "Australia", CountryCode: 'AU' }, 
    { code: "AU", currency: "GBP", country: "Christmas Islands", CountryCode: 'CX' },
    { code: "ROW", currency: "GBP", country: "Hong Kong", CountryCode: 'HK' }, 
    { code: "ROW", currency: "GBP", country: "China", CountryCode: 'CN' },
]

const buildCountryUrls = (product_ids,index) => {
    let cryptedUrls = []
    let countryObject = {}

    for(let i=0; i < product_ids.length; i++) {
        let tempUrl = baseUrl + product_ids[i] + 
                        '?store=' + countries[index].code +
                        '&currency=' + countries[index].currency;
    
        if(countries[index].CountryCode != null)
            tempUrl = tempUrl + '&country=' + countries[index].CountryCode
        cryptedUrls.push(tempUrl);
    }

    countryObject[countries[index].code.toLowerCase()] = {
        country: countries[index].country,
        currency: countries[index].currency,
        code: countries[index].code.toLowerCase(),
        CountryCode: countries[index].CountryCode,
        urls: cryptedUrls,
    }

    return countryObject;
}

const buildAllCountriesUrls = async (urls) => {
    product_ids = []
    allCountries = []
    for(let i=0; i < urls.length; i++) {
        let productID = urls[i].url.split('/');
        productID = productID[productID.length-1].split('?')[0]; // Get Product ID From link
        product_ids.push(productID);
    }

    for(let j=0; j < countries.length; j++) {
        allCountries.push(await buildCountryUrls(product_ids, j))
    }

    return allCountries;
}

const getCustomUrl = (product_url,country,currency) => {
    let productID = product_url.split('/');
    productID = productID[productID.length-1].split('?')[0]; // Get Product ID From link
    let url = baseUrl + productID + 
        '?store=' + country
        
    if(currency)
        url += '&currency=' + currency

    return url;
}

module.exports.getCustomUrl = getCustomUrl;
module.exports.buildAllCountriesUrls = buildAllCountriesUrls;