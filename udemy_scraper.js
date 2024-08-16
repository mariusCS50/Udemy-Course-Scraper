const puppeteer = require('puppeteer');
const XLSX = require('xlsx');

// Check if the WebSocket Debugger URL is provided as an argument
const browserWSEndpoint = process.argv[2];
if (!browserWSEndpoint) {
  console.error('Please provide the WebSocket endpoint as an argument.');
  process.exit(1);
}

const url = "https://answersq.com/udemy-paid-courses-for-free-with-certificate/";

function generateXLS(data) {
  // Generate the final table data
  const tableData = data.map(item => ({
    course: { t: 's', v: item.title, l: { Target: item.url, Tooltip: 'Go to course page' } },
    stars: item.stars,
    ratings: item.ratings,
    participants: item.participants
  }));

  // Generate the sheet with the final table data excluding the headers
  const worksheet = XLSX.utils.json_to_sheet(tableData, { origin: 'A2', skipHeader: true });

  // Add headers manually
  const headers = ['Title', 'Stars', 'Ratings', 'Participants'];
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  // Adjust column widths
  worksheet['!cols'] = [
    { width: 60 },
    { width: 10 },
    { width: 15 },
    { width: 20 }
  ];

  // Create and export the workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Udemy Courses");

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date();

  XLSX.writeFile(workbook, "courses-" + months[date.getMonth()] + date.getDate() + ".xlsx");
}

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
    return Array.from(document.querySelector('ul.wp-block-list').querySelectorAll('li a'))
                .map(a => a.href);
  });

  let data = [];

  // Iterate over each course link and scrape course data
  for (const link of courseLinks) {
    await page.goto(link);

    const courseData = await page.evaluate(() => {
      // Extract the course's title
      const titleElement = document.querySelector('.ud-heading-xl.clp-lead__title.clp-lead__title--small');
      const title = titleElement ? titleElement.textContent.trim() : null;

      // Extract the course's star rating
      const ratingElement = document.querySelector('.ud-heading-sm.star-rating-module--rating-number--2-qA2');
      const starRating = ratingElement ? parseFloat(ratingElement.textContent.replace(',', '.')) : null;

      // Extract the number of ratings
      const numberOfRatingsElement = document.querySelectorAll('a.ud-btn.ud-btn-large.ud-btn-link.ud-heading-md.ud-text-sm.styles--rating-wrapper--YkK4n span');
      const numberOfRatings = numberOfRatingsElement[3] ? parseInt(numberOfRatingsElement[3].textContent.replace('(', '').split(' ')[0].replace('.', '')) : null;

      // Extract the number of enrolled participants
      const enrollmentElement = document.querySelector('.enrollment');
      const numberOfParticipants = enrollmentElement ? parseInt(enrollmentElement.textContent.split(' ')[0].replace(',', '')) : null;

      return {
        title,
        starRating,
        numberOfRatings,
        numberOfParticipants,
      };
    });

    // Append the course information into the data structure
    if (Object.values(courseData).every(field => field != null)) {
      data.push({ url: link, title: courseData.title, stars: courseData.starRating,
                  ratings: courseData.numberOfRatings, participants: courseData.numberOfParticipants });
    }
  }

  // Sort the data based on rating and number of ratings
  data.sort((courseA, courseB) => courseB.ratings - courseA.ratings || courseB.stars - courseA.stars);

  // Generate the XLSX file containing the data
  generateXLS(data);

  // Close the page and disconnect from the browser
  await page.close();
  await browser.disconnect();
}

scrapeCourses(url);