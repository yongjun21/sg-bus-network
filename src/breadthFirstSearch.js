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

    Object.assign(visited, {
      to (destination) {
        if (!destination) throw new Error('Requires destination')

        if (!(destination in visited)) return null

        const path = []
        let target = destination
        while (target) {
          path.push(target)
          target = visited[target] && visited[target][0]
        }
        path.reverse()
        return path
      }
    })

    return visited
  }
}

const bfs = new BFS(graph)
const test = bfs.from('76209').to('18151')

fs.writeFileSync('data/test.json', JSON.stringify(test, null, '\t'))
