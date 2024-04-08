import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { readFileSync, writeFileSync } from 'fs';
import App from './App';

import express from 'express';
const app = express();

app.get('/', (req, res) => {
    // Render the App component to a string
    const appString = ReactDOMServer.renderToString(<App />);

    // Send the rendered App component as the response
    res.send(appString);
});

app.listen(5000, () => console.log('http://localhost:5000'));
