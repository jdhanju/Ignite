import express from 'express';
import pg from 'pg';
import cors from 'cors';
import session from 'express-session';
import userRouter from './routes/users.js'
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const app = express();
const PORT = 8000;
const eventbrite_api = process.env.EVENTBRITE_API_KEY
const ticketmaster_api = process.env.TICKETMASTER_API_KEY

const pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: "dateplanner"
})

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000*60*60,
    httpOnly: true   // Security concern if set to false...
  }
}));

app.use("/users", userRouter);

app.get('/mydates', (req, res) => {
  let myDatesQuery = `SELECT * FROM events`
  pool.query(myDatesQuery, (err, result) => {
    if (err) {
      res.end(err)
    }
    res.send(result.rows)
  })
})

app.get('/eventbrite', (req,res) => {
  let url = `https://www.eventbriteapi.com/v3/venues/1234/?token=${eventbrite_api}`
  fetch(url, {credentials: "include"})
    .then((response) => {
      return response.json()
    }) 
    .then((data) => {
      res.send(data)
    })
    .catch (error => {
      res.end(error);
    })
})

app.get('/ticketmaster', (req,res) => {
  let startTime = "2023-07-09T01:00:00Z"
  let endTime = "2023-07-14T23:59:00Z"
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=CA&city=Vancouver&startDateTime=${startTime}&endDateTime=${endTime}&apikey=${ticketmaster_api}`
  fetch(url, {credentials: "include"})
    .then((response) => {
      return response.json()
    }) 
    .then((data) => {
      res.send(data._embedded.events)
    })
    .catch (error => {
      res.end(error);
    })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})