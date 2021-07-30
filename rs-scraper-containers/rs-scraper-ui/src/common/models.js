export class ScrapedSiteInput {
  constructor(id, targetUrl, reScrape, numberOfPages) {
    this.id = id;
    this.targetUrl = targetUrl;
    this.reScrape = reScrape;
    this.numberOfPages = numberOfPages;
  }
}

export class ScrapedArticleResult {
  constructor({ title, articleUrl, authorName, description }) {
    this.title = title;
    this.articleUrl = articleUrl;
    this.authorName = authorName;
    this.description = description;
  }
}

export class ScrapedPageResult {
  constructor({ pageNumber, articleCount, articles }) {
    this.pageNumber = pageNumber;
    this.articleCount = articleCount;
    this.articles = articles;
  }
}

export class ScrapedSiteResult {
  constructor({ targetUrl, hitCount, pageCount, scrapedPages }) {
    this.targetUrl = targetUrl;
    this.hitCount = hitCount;
    this.pageCount = pageCount;
    this.scrapedPages = scrapedPages;
  }
}
