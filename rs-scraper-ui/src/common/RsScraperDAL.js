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

const getScrapedSiteQuery = (id) => {
  return JSON.stringify({
    query: `{id: ${id}}`,
  });
};

export const getOrCreateScrapedSiteWithId = async () => {
  fetch(localQraphqlUrl, {
    ...fetchDefaults,
    body: JSON.stringify(getOrCreateScrapedSiteQuery),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.data.getOrCreateScrapedSite) {
        console.log(res.data);
        const response = res.data.getOrCreateScrapedSite.id;
        return response;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getScrapedSite = async () => {
  fetch(localQraphqlUrl, {
    ...fetchDefaults,
    body: getScrapedSiteQuery(),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.data.getScrapedSite) {
        console.log(res.data.getScrapedSite);
        const respone = res.data.getScrapedSite;
        console.log(`getScrapedSiteQuery - response: ${respone}`);
      } else {
        console.log(`getScrapedSiteQuery - response: ${res}`);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// basic mock response only for ping
export const getTargetUrl = () => {
  fetch(localQraphqlUrl, {
    ...fetchDefaults,
    body: JSON.stringify(targetUrlQuery),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};
