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

  for (const link of courseLinks) {
    await page.goto(link);

    const courseData = await page.evaluate(() => {
      const ratingText = document.querySelector('.ud-heading-sm.star-rating-module--rating-number--2-qA2');
      const rating = ratingText ? parseFloat(ratingText.textContent.replace(',', '.')) : null;

      const enrollmentText = document.querySelector('.enrollment');
      const participants = enrollmentText ? parseInt(enrollmentText.textContent.split(' ')[0]) : null;

      return {
        rating,
        participants,
      };
    });

    console.log(`Course URL: ${link}`);
    console.log(`Stars: ${courseData.rating}`);
    console.log(`Participants: ${courseData.participants}`);
  }

  await browser.close();
}

scrapeCourses(url);
