import cron from 'node-cron'
import { chromium } from 'playwright'
import twilio from 'twilio'
import 'dotenv/config'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const myPhoneNumber = process.env.MY_PHONE_NUMBER

const client = twilio(accountSid, authToken)
const productUrl = 'https://www.330ohms.com/collections/raspberry-pi-400/products/raspberry-pi-400-kit-oficial-en-espanol'

async function checkRaspberryStock () {
  console.log('running cron job')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(productUrl)
  const productDetails = await page.locator('[aria-live="polite"]:has-text("Stock")')
  const stock = await productDetails.locator('b').innerText()
  const stockCount = Number(stock)
  const hasStock = stockCount > 0
  await page.close()
  await browser.close()
  if (!hasStock) {
    console.log('out of stock')
    return
  }
  const message = await client.messages
    .create({
      body: `Stock: ${stockCount}. ${hasStock ? 'Available' : 'Not available'}. ${productUrl}`,
      from: twilioPhoneNumber,
      to: myPhoneNumber
    })
  console.log('message sent:', message.sid)
}

cron.schedule('3 20 * * *', checkRaspberryStock, { timezone: 'America/Mexico_City' })
