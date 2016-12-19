import _ from 'lodash'
import fs from 'fs'

import graph from '../data/graph.json'

export default class BFS {
  constructor (graph) {
    this.groupedByStart = _.groupBy(graph, 'start')
    this.groupedByEnd = _.groupBy(graph, 'end')
  }

  from (origin, limit) {
    if (!origin) throw new Error('Requires origin')
    if (limit) this.limit = limit

    if (!this.visited || !this.destination) {
      const visited = {[origin]: null}
      const toVisit = [origin]
      let pointer = 0

      while (pointer < toVisit.length) {
        const target = toVisit[pointer]
        if (target in this.groupedByStart) {
          for (let neighbour of this.groupedByStart[target]) {
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

    const paths = this.backtrack(origin, this.visited, this.limit)
    this.destination = null
    this.visited = null
    this.limit = 0
    return paths
  }

  to (destination, limit) {
    if (!destination) throw new Error('Requires destination')
    if (limit) this.limit = limit

    if (!this.visited || !this.origin) {
      const visited = {[destination]: null}
      const toVisit = [destination]
      let pointer = 0

      while (pointer < toVisit.length) {
        const target = toVisit[pointer]
        if (target in this.groupedByEnd) {
          for (let neighbour of this.groupedByEnd[target]) {
            if (neighbour.start in visited) {
              if (visited[neighbour.start]) visited[neighbour.start].push(target)
            } else {
              visited[neighbour.start] = [target]
              toVisit.push(neighbour.start)
            }
          }
        }
        pointer++
      }

      this.destination = destination
      this.visited = visited

      return this
    }

    const paths = this.backtrack(destination, this.visited, this.limit)
    this.origin = null
    this.visited = null
    this.limit = null
    return paths.map(p => p.reverse())
  }

  backtrack (leaf, tree, limit) {
    if (!(leaf in tree)) return null

    const paths = []
    function tracePath (path, next) {
      if (limit) {
        if (path.length > limit + 1) return
      } else {
        if (paths.length > 0) return
      }
      if (next) {
        next.forEach(target => {
          tracePath([...path, target], tree[target])
        })
      } else {
        paths.push(path)
      }
    }
    tracePath([leaf], tree[leaf])

    return _.sortBy(paths, p => p.length)
  }
}

const bfs = new BFS(graph)
const test = bfs
  .from('43251')
  .to('18151', 20)

fs.writeFileSync('data/test.json', JSON.stringify(test, null, '\t'))
