import _ from 'lodash'
import fs from 'fs'
import BusRoutes from '../data/BusRoutes.json'
import BusStops from '../data/BusStops.json'
const keyedBusStops = _.keyBy(BusStops, 'BusStopCode')

// const graph = buildGraph()
// fillLatLng(graph)
// fs.writeFileSync('data/graph.json', JSON.stringify(graph, null, '\t'))

const graph2 = buildGraph2()
fs.writeFileSync('data/graph2.json', JSON.stringify(graph2, null, '\t'))

export function buildGraph () {
  const graph = {}
  const grouped = _.groupBy(BusRoutes,
    route => route.ServiceNo + '.' + route.Direction)
  Object.keys(grouped).forEach(key => {
    const sorted = _.sortBy(grouped[key], 'StopSequence')
    for (let i = 1; i < sorted.length; i++) {
      const start = sorted[i - 1].BusStopCode
      const end = sorted[i].BusStopCode
      const edge = start + '.' + end
      if (!(edge in graph)) graph[edge] = {start, end, service: []}
      graph[edge].service.push(key)
    }
  })
  return _.values(graph)
}

export function buildGraph2 () {
  const graph = {}
  const grouped = _.groupBy(BusRoutes,
    route => route.ServiceNo + '.' + route.Direction)
  Object.keys(grouped).forEach(key => {
    const sorted = _.sortBy(grouped[key], 'StopSequence')
    for (let i = 0; i < sorted.length - 1; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const start = sorted[i].BusStopCode
        const end = sorted[j].BusStopCode
        const edge = start + '.' + end
        if (!(edge in graph)) graph[edge] = {start, end, service: []}
        graph[edge].service.push(key)
      }
    }
  })
  return _.values(graph)
}

export function fillLatLng (graph) {
  graph.forEach(edge => {
    const {start, end} = edge
    const startStop = findBusStops(start)
    const endStop = findBusStops(end)
    if (!startStop || !endStop) return
    if (startStop.Latitude === 0 || startStop.Longitude === 0) return
    if (endStop.Latitude === 0 || endStop.Longitude === 0) return
    edge.query = {
      origin: [startStop.Latitude, startStop.Longitude],
      destination: [endStop.Latitude, endStop.Longitude]
    }
  })
  return graph
}

function findBusStops (key) {
  if (!(key in keyedBusStops)) {
    console.log('Bus stop not found', key)
    return
  }
  return keyedBusStops[key]
}
