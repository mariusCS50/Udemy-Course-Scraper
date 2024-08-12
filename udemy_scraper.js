const puppeteer = require('puppeteer');

const url = "https://answersq.com/udemy-paid-courses-for-free-with-certificate/";

async function scrapeCourses(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const courseLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('ul.wp-block-list li a'))
                .map(a => a.href);
  });

  console.log(courseLinks.length)

  await browser.close();
}

scrapeCourses(url);
