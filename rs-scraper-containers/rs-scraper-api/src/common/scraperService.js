import { ScrapedPage, ScrapedArticle } from "../repository/models.js";
import axios from "axios";
import cheerio from "cheerio";

const getScrapedPageData = async (url) => {
  const scrapedPage = new ScrapedPage({
    articleCount: 0,
    articles: [],
  });
  let scrapeError;
  try {
    await axios.get(url).then((res) => {
      const $ = cheerio.load(res.data);

      $("article").each((index, articleElement) => {
        const articleTitle = $(articleElement).find("h1").text();
        const articleUrl = $(articleElement).find("a").attr("href");
        const authorName = $(articleElement).find(".post-author").text();
        const postContent = $(articleElement).find(".post-content").text();

        /* console.log({
          articleTitle,
          articleUrl,
          authorName,
          authorName,
          postContent,
        }); */

        const article = new ScrapedArticle({
          title: articleTitle,
          articleUrl: articleUrl,
          authorName: authorName,
          description: postContent,
        });

        scrapedPage.articles.push(article);
      });

      scrapedPage.articleCount = scrapedPage.articles.length;
    });
  } catch (error) {
    scrapeError = error;
  }

  return new Promise((resolve, reject) => {
    if (scrapedPage.articles) {
      resolve(scrapedPage);
    } else {
      reject(scrapeError);
    }
  });
};

export const scrapeSitePages = async (targetUrlSubPageCollection) => {
  console.log(`scraping: ${JSON.stringify(targetUrlSubPageCollection)}`);

  try {
    const pages = [];
    for (let index = 0; index < targetUrlSubPageCollection.length; index++) {
      const page = await getScrapedPageData(targetUrlSubPageCollection[index]);
      page.pageNumber = index + 1;
      pages.push(page);
    }
    return new Promise((resolve, reject) => {
      if (pages.length > 0) {
        resolve(pages);
      }
    });
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
};
