const localQraphqlUrl = "http://localhost:4242/graphql";
const fetchDefaults = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const targetUrlQuery = { query: `{ targetUrl }` };

const getOrCreateScrapedSiteQuery = {
  query: `mutation {
    getOrCreateScrapedSite(input: {targetUrl: "to the stars"}) {
      id
    }
}`,
};

export const getOrCreateScrapedSiteWithId =  async () => {
  fetch(localQraphqlUrl, {
    ...fetchDefaults,
    body: JSON.stringify(getOrCreateScrapedSiteQuery),
  })
    .then((res) => res.json())
    .then((res) => {
        const response = res.data.getOrCreateScrapedSite.id;
        console.log(response)
      return response;
    });
};

export const getTargetUrl = () => {
  fetch(localQraphqlUrl, {
    ...fetchDefaults,
    body: JSON.stringify(targetUrlQuery),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};
