const puppeteer = require('puppeteer');

// Check if the WebSocket Debugger URL is provided as an argument
const browserWSEndpoint = process.argv[2];
if (!browserWSEndpoint) {
  console.error('Please provide the WebSocket endpoint as an argument.');
  process.exit(1);
}

const url = "https://answersq.com/udemy-paid-courses-for-free-with-certificate/";

async function scrapeCourses(url) {
  // Connect to the existing browser instance via the WebSocket endpoint
  const browser = await puppeteer.connect({
    browserWSEndpoint: browserWSEndpoint
  });

  // Open a new page in the browser
  const page = await browser.newPage();
  await page.goto(url);

  // Extract all course links from the website
  const courseLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('ul.wp-block-list li a'))
                .slice(0, 10).map(a => a.href);
  });

  let data = [];

  // Iterate over each course link and scrape course data
  for (const link of courseLinks) {
    await page.goto(link);

    const courseData = await page.evaluate(() => {
      // Extract the course's star rating
      const ratingText = document.querySelector('.ud-heading-sm.star-rating-module--rating-number--2-qA2');
      const starRating = ratingText ? parseFloat(ratingText.textContent.replace(',', '.')) : null;

      // Extract the number of ratings
      const numberOfRatingsText = document.querySelectorAll('a.ud-btn.ud-btn-large.ud-btn-link.ud-heading-md.ud-text-sm.styles--rating-wrapper--YkK4n span');
      const numberOfRatings = numberOfRatingsText[3] ? parseInt(numberOfRatingsText[3].textContent.replace('(', '').split(' ')[0].replace('.', '')) : null;

      // Extract the number of enrolled participants
      const enrollmentText = document.querySelector('.enrollment');
      const numberOfParticipants = enrollmentText ? parseInt(enrollmentText.textContent.split(' ')[0].replace(',', '')) : null;

      return {
        starRating,
        numberOfRatings,
        numberOfParticipants,
      };
    });

    data.push({ url: link,
                stars: courseData.starRating,
                ratings: courseData.numberOfRatings,
                participants: courseData.numberOfParticipants});

  }

  data.sort((a, b) => b.ratings - a.ratings || b.stars - a.stars);
  console.log(data);

  // Close the page and disconnect from the browser
  await page.close();
  await browser.disconnect();
}

scrapeCourses(url);
