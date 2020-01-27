import path from 'path'
import fs from 'fs'

import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom';
import 'isomorphic-fetch';

import App from '../src/App'

const PORT = 8080
const app = express();

app.use('/static', express.static(path.join(__dirname, '/..', '/build/static')))

app.get('*', (req, res, next) => {
  const context = {};      
  const app = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );  
  fs.readFile(path.resolve('./build/index.html'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('An error occurred')
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${app}</div>`
      )
    )
  })
});


app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`)
})