import proj4 from 'proj4'
import polyline from '@mapbox/polyline'
import fs from 'fs'

const SVY21 = '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs'
const SVY21proj = proj4('WGS84', SVY21)

import networkGraph from '../data/graph.json'

export default function calculateDistance (graph) {
  return graph.map(edge => {
    if (!('polyline' in edge)) return edge
    const xy = polyline.decode(edge.polyline).map(latlng => SVY21proj.forward([latlng[1], latlng[0]]))
    const directDistance = eucliDist(xy[0], xy[xy.length - 1])
    let distance = 0
    for (let i = 1; i < xy.length; i++) {
      distance += eucliDist(xy[i], xy[i - 1])
    }
    return Object.assign({}, edge, {directDistance, distance})
  })
}

fs.writeFileSync('data/graph.json', JSON.stringify(calculateDistance(networkGraph), null, '\t'))

function eucliDist ([x1, y1], [x2, y2]) {
  return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5)
}
