const axios = require('axios')
const cheerio = require('cheerio')
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

const url  = 'https://www.amazon.fr/Apple-24-Pouces-Apple-M1-c%C5%93urs-256-Go/dp/B09332W88J'

const handle = setInterval(scrape, 20000)
const product = {name: "", price:"", link:""}

async function scrape(){
	// grace a axios on fait une requete get sur l'url
	const {data} = await axios.get(url)
	const $ = cheerio.load(data)
	// grace a cheerio on scrape les informations qu'on demande 
	const item = $('div#dp-container')
	product.name = $(item).find('h1 span#productTitle').text()
	product.price = $(item).find('span .a-price-whole').first().text().replace(/[,.]/g, "")
	product.link = url
	// gracea twilio on on envoie le message 
	client.messages.create({
		body: `The price of ${product} is ${product.price}. Purschase it at ${product.link}`,
		from: "the twilio number",
		to:"your number"
	}).then(message =>{
		clearInterval(handle)
	})

}

scrape()