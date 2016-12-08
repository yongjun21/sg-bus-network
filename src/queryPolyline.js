import graph from '../data/graph.json'
import fs from 'fs'
import _ from 'lodash'

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  timeout: 60 * 60 * 1000,
  Promise
})

const keyedGraph = _.keyBy(graph, edge => edge.start + '.' + edge.end)
queryPolyline(keyedGraph).then(graph => {
  fs.writeFileSync('data/graph.json', JSON.stringify(_.values(graph), null, '\t'))
})

export default function queryPolyline (graph) {
  const polylineQueries = Object.keys(graph)
    .slice(0, 0)
    .filter(key => 'query' in graph[key])
    .map(key => {
      return googleMapsClient.directions(graph[key].query).asPromise()
        .then(res => res.json)
        .then(json => {
          if (json.status !== 'OK') return null
          return [key, json.routes[0].overview_polyline.points]
        })
        .catch(err => { throw err })
    })

  return Promise.all(polylineQueries)
    .then(polylines => {
      polylines
        .filter(v => !_.isNull(v))
        .forEach(([k, v]) => {
          graph[k].polyline = v
        })
      return graph
    })
    .catch(err => { throw err })
}
