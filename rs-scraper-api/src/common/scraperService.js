const { ScrapedPage, ScrapedArticle } = require("../repository/models");
const axios = require("axios");
const cheerio = require("cheerio");

const getScrapedPageData = async (targetUrl, subPageUrl) => {
  const articles = [];
  await axios.get(`${targetUrl}${subPageUrl}`).then((res) => {
    const $ = cheerio.load(res.data);

    $("article").each((index, element) => {
      const articleTitle = $(element).find("h1").text();
      const articleUrl = $(element).attr("href");
      console.log(element.children);
      const article = new ScrapedArticle({
        title: `${articleTitle}`,
        articleUrl: articleUrl,
        authorName: "me",
        description: ``,
      });
      articles.push(article);
    });
  });

  const scrapedPage = new ScrapedPage({
    pageNumber: 0,
    articleCount: articles.length,
    articles: articles,
  });

  console.log(scrapedPage);
  return scrapedPage;
};

export const getScrapedPages = async (numberOfPages) => {
  if (!numberOfPages || typeof numberOfPages !== "number") {
    throw new Error(`invalid input for number, got: ${numberOfPages}`);
  }
  const pages = [];
  for (let index = 0; index < numberOfPages; index++) {
    const page = await getScrapedPageData(
      "https://blog.risingstack.com",
      "/page/5/"
    );
    pages.push(page);
    //console.log(`page data: ${page}`);
  }

  //console.log(`pages: ${pages}`);

  return pages;
};
