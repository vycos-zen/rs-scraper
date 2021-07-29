const { ScrapedPage, ScrapedArticle } = require("../repository/models");
const axios = require("axios");
const cheerio = require("cheerio");

const getScrapedPageData = async (targetUrl, subPageUrl) => {
  const articles = [];
  await axios.get(`${targetUrl}${subPageUrl}`).then((res) => {
    const $ = cheerio.load(res.data);

    $("article").each((index, articleElement) => {
      const articleTitle = $(articleElement).find("h1").text();
      const articleUrl = $(articleElement).find("a").attr("href");
      const authorName = $(articleElement).find(".post-author").text();
      const postContent = $(articleElement).find(".post-content").text();

      console.log({
        articleTitle,
        articleUrl,
        authorName,
        authorName,
        postContent,
      });
      const article = new ScrapedArticle({
        title: articleTitle,
        articleUrl: articleUrl,
        authorName: authorName,
        description: postContent,
      });
      articles.push(article);
    });
  });

  const scrapedPage = new ScrapedPage({
    pageNumber: 0,
    articleCount: articles.length,
    articles: articles,
  });

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
