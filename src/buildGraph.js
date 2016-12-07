import _ from 'lodash'
import fs from 'fs'
import BusRoutes from '../data/BusRoutes.json'
import BusStops from '../data/BusStops.json'
const keyedBusStops = _.keyBy(BusStops, 'BusStopCode')

const graph = buildGraph()
fillLatLng(graph)
fs.writeFileSync('data/graph.json', JSON.stringify(graph, null, '\t'))

export default function buildGraph () {
  const graph = {}
  const grouped = _.groupBy(BusRoutes,
    route => route.ServiceNo + '.' + route.Direction)
  Object.keys(grouped).forEach(key => {
    const sorted = _.sortBy(grouped[key], 'StopSequence')
    for (let i = 1; i < sorted.length; i++) {
      const edge = sorted[i - 1].BusStopCode + '.' + sorted[i].BusStopCode
      if (!(edge in graph)) graph[edge] = {service: []}
      graph[edge].service.push(key)
    }
  })
  return graph
}

export function fillLatLng (graph) {
  Object.keys(graph).forEach((key, i) => {
    const [start, end] = key.split('.')
    const startStop = findBusStops(start)
    const endStop = findBusStops(end)
    if (!startStop || !endStop) return
    if (startStop.Latitude === 0 || startStop.Longitude === 0) return
    if (endStop.Latitude === 0 || endStop.Longitude === 0) return
    graph[key].query = {
      origin: [startStop.Latitude, startStop.Longitude],
      destination: [endStop.Latitude, endStop.Longitude]
    }
  })
  return graph
}

function findBusStops (key) {
  if (!(key in keyedBusStops)) {
    console.log(key)
    return
  }
  return keyedBusStops[key]
}
