import _ from 'lodash'
import fs from 'fs'

import graph from '../data/graph.json'

export default class BFS {
  constructor (graph) {
    this.graph = _.groupBy(graph, 'start')
  }

  from (origin) {
    if (!origin) throw new Error('Requires origin')

    const visited = {[origin]: null}
    const toVisit = [origin]
    let pointer = 0

    while (pointer < toVisit.length) {
      const target = toVisit[pointer]
      if (target in this.graph) {
        for (let neighbour of this.graph[target]) {
          if (neighbour.end in visited) {
            if (visited[neighbour.end]) visited[neighbour.end].push(target)
          } else {
            visited[neighbour.end] = [target]
            toVisit.push(neighbour.end)
          }
        }
      }
      pointer++
    }

    this.origin = origin
    this.visited = visited

    return this
  }

  to (destination, limit) {
    if (!this.visited) throw new Error('Origin not set')
    if (!destination) throw new Error('Requires destination')

    if (!(destination in this.visited)) return null

    const paths = []
    const visited = this.visited
    function tracePath (path, next) {
      if (limit) {
        if (path.length > limit + 1) return
      } else {
        if (paths.length > 0) return
      }
      if (next) {
        next.forEach(target => {
          tracePath([...path, target], visited[target])
        })
      } else {
        paths.push(path.reverse())
      }
    }
    tracePath([destination], visited[destination])

    return _.sortBy(paths, p => p.length)
  }
}

const bfs = new BFS(graph)
const test = bfs.from('76209').to('18151', 25)

fs.writeFileSync('data/test.json', JSON.stringify(test, null, '\t'))
