const { chromium } = require('playwright-chromium')

exports.handler = async function (event, context) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('https://www.330ohms.com/collections/raspberry-pi-400/products/raspberry-pi-400-kit-oficial-en-espanol')
  const productDetails = await page.locator('[aria-live="polite"]:has-text("Stock")')
  const stock = await productDetails.locator('b').innerText()
  const stockCount = Number(stock)
  const hasStock = stockCount > 0
  console.log({ stockCount, hasStock })
  await page.close()
  await browser.close()
  if (!hasStock) return { statusCode: 200, body: 'No stock' }
  console.log('We have stock!')
  return { statusCode: 200, body: 'We have stock!' }
  // TODO Send me a notification
}
