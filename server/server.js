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

app.get('*', async (req, res, next) => {
  const tasks = await fetch('http://localhost:5000/');
  const response = await tasks.json();

  const projects = await fetch('http://localhost:5000/projects');
  const result = await projects.json();
  let initialData = {
    tasks: response,
    projects: result
  }
  const context = {};      
  const app = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App initialData={initialData} />
    </StaticRouter>
  );  
  fs.readFile(path.resolve('./build/index.html'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('An error occurred')
    }      
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${app}</div>
        <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(initialData).replace(
          /</g,
          '\\u003c'
        )}
        </script>`
      )
    )
  })
});


app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`)
})