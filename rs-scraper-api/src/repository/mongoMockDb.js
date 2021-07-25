import { nanoid } from "nanoid";

const inMemoryOfDatabase = {};
inMemoryOfDatabase.scrapedSite = {};


const root = {
  targetUrl: () => {
    return "to the starts";
  },
  getOrCreateScrapedSite: ({ targetUrl }) => {
    /* console.log({ input }); */
    const instanceId = "id001";
    const siteData = getOrCreateScrapedSite(targetUrl);
    return { ...siteData };
  },
  getScrapedSite: ({ id }) => {
    const siteData = getScrapedSite(id);
    console.log(siteData);
    return siteData ? siteData : null;
  },
};


export const getOrCreateScrapedSite = (targetUrl) => {
  console.log(`object keys - ${Object.keys(inMemoryOfDatabase.scrapedSite)}`);
  console.log(`object values - ${Object.values(inMemoryOfDatabase)}`);
  if (id && targetUrl) {
    if (Object.entries().some()) {
      return Object.entries()[0];
    } else {
      inMemoryOfDatabase.scrapedSite[id] = {
        id: nanoid(),
        targetUrl: targetUrl,
      };
    }
  } else console.log(`failed to getOrCreateScrapedSite`);
};

export const getScrapedSite = (id) => {
  console.log(`hit getScrapedSite`);
};
