import { chromium } from 'playwright'

(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('https://www.330ohms.com/collections/raspberry-pi-400')
  const rapsberryCard = await page.locator('.productitem--info:has-text("Raspberry Pi 400 - Kit en Español")')
  const stock = await rapsberryCard.locator('text=Stock')
  console.log(await stock.innerText())
  const stockCountRaw = await stock.locator('b').innerText()
  const stockCount = Number(stockCountRaw)
  const hasStock = stockCount > 0
  console.log(stockCount)
  if (!hasStock) return
  console.log('We have stock!')
  // TODO Send me a notification
  await browser.close()
})()
