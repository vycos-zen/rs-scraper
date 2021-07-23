const localQraphqlUrl = "http://localhost:4242/graphql"

export const getTargetUrl = () => {
    fetch(localQraphqlUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({query: `{ targetUrl }`})
    }).then(res => res.json())
    .then(data => console.log(data))
}