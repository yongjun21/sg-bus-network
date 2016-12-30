import graph from '../data/graph.json'
// import cleaned from '../data/toCheck.json'
import fs from 'fs'

const cutoff = 1.5

const filtered = graph
  .filter(edge => 'polyline' in edge)
  .filter(edge => edge.distance / edge.directDistance > cutoff)
  .filter(edge => edge.distance > 800)
filtered.forEach(edge => {
  edge.tmp = [edge.query.origin, edge.query.destination]
})

// cleaned.forEach(replacement => {
//   const match = graph.find(edge => edge.start === replacement.start && edge.end === replacement.end)
//   match.polyline = replacement.polyline
// })

console.log(filtered.length)

fs.writeFileSync('data/toCheck2.json', JSON.stringify(filtered, null, '\t'))
