import fs from 'fs'
import {fetchData} from './helpers'

const url = 'http://datamall2.mytransport.sg/ltaodataservice/'

const endpoints = ['BusServices', 'BusRoutes', 'BusStops']

endpoints.forEach(ep => {
  fetchData(url + ep, 50).then(result => {
    fs.writeFileSync('data/' + ep + '.json', JSON.stringify(result, null, '\t'))
  }).catch(err => {
    console.error(err.stack)
  })
})
