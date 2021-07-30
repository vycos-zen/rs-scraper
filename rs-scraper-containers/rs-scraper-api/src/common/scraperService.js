import { ScrapedPage, ScrapedArticle } from "../repository/models.js";
import axios from "axios";
import cheerio from "cheerio";

const getScrapedPageData = async (targetUrl, subPageUrl) => {
  const articles = [];
  await axios.get(`${targetUrl}${subPageUrl}`).then((res) => {
    const $ = cheerio.load(res.data);

    $("article").each((articleElement) => {
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

export const scrapeSitePages = async (targetUrlSubPageCollection) => {
  if (
    !targetUrlSubPageCollection ||
    typeof targetUrlSubPageCollection !== "number"
  ) {
    throw new Error(
      `invalid input for number, got: ${targetUrlSubPageCollection}`
    );
  }
  const pages = [];
  for (let index = 0; index < targetUrlSubPageCollection.length; index++) {
    const page = await getScrapedPageData(targetUrlSubPageCollection[index]);
    page.pageNumber = index;
    pages.push(page);
    //console.log(`page data: ${page}`);
  }

  //console.log(`pages: ${pages}`);

  return pages;
};
