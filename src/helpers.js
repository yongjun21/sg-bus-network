import fetch from 'node-fetch'

const headers = {
  AccountKey: process.env.DATAMALL_ACCOUNT_KEY,
  accept: 'application/json'
}

export function fetchData (url, offset) {
  console.log(url)
  function recursiveFetch (skip, result = []) {
    return fetch(url + '?$skip=' + skip, {headers})
      .then(response => response.json())
      .then(json => json.value)
      .then(arr => {
        result = result.concat(arr)
        if (arr.length < offset) return result
        return recursiveFetch(skip + offset, result)
      })
      .catch((err) => { throw err })
  }

  return recursiveFetch(0)
}
