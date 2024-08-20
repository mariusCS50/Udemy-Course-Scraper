<a id="readme-top"></a>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Udemy Course Scraper is a Node.js tool that scrapes free Udemy courses listed on the [AnswersQ website](https://answersq.com/udemy-paid-courses-for-free-with-certificate/). The scraper extracts the course title, star rating, number of ratings, and number of participants. The data is then saved into an Excel file, allowing you to easily track and explore available courses.

### Built With

- [Puppeteer](https://pptr.dev/) - Headless browser automation
- [XLSX](https://www.npmjs.com/package/xlsx) - Excel file manipulation

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites


- currently the scraper is designed to work only on Windows
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Node.js and npm:**

   If you don't have Node.js installed, you can download and install it from [nodejs.org](https://nodejs.org/). This will also install npm, the Node.js package manager.

2. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/udemy-course-scraper.git
    cd udemy-course-scraper
    ```

3. **Install the required npm packages:**

    ```bash
    npm install puppeteer xlsx
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

1. **Start a Puppeteer browser instance with WebSocket debugging enabled:**

    To use this scraper, you need to connect to an existing browser instance with WebSocket debugging enabled. You can start such an instance by running:

    ```bash
    start browser-name --remote-debugging-port=9222 http://localhost:9222/json/version
    ```

    where browser-name is the name of your default browser. For example:

    * chrome for Google Chrome
    * msedge for Microsoft Edge
    * opera for Opera or Opera GX

This will give you the WebSocket Debugger URL, which is needed to run the scraper.

2. **Run the scraper:**

    Run the following command, replacing `<WebSocketDebuggerURL>` with the actual WebSocket URL obtained from the previous step:

    ```bash
    node .\udemy_scraper.js <WebSocketDebuggerURL>
    ```

    A new window should open up in your browser where the scraper collects data from different courses.

## Output

The output is an Excel file containing the following columns:

- **Title**: The title of the Udemy course with a hyperlink to the course page.
- **Stars**: The star rating of the course.
- **Ratings**: The number of people who have rated the course.
- **Participants**: The number of participants enrolled in the course.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the GNU General Public License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.