// Create express app
const express = require("express");
const app = express();

app.use(express.json());  
const provider = require('./scripts/f1-server.js'); 

// Default URL displays nothing
app.get("/", (req, resp) => {
  resp.status(200).end();
});

// Circuit URLs
app.get("/api/circuits", (req, resp) => {
  provider.retrieveCircuits(req, resp);
});

app.get("/api/circuits/ref/:ref", (req, resp) => {
  provider.retrieveCircuitByRef(req, resp);
});

// This route will try to match by reference first, then by ID
app.get("/api/circuits/:param", (req, resp) => {
  const param = req.params.param;
  // If it's a number, treat it as an ID
  if (!isNaN(param)) {
    provider.retrieveSingleCircuit(req, resp);
  } else {
    // Otherwise treat it as a reference
    provider.retrieveCircuitByRef(req, resp);
  }
});

// Race URLs
app.get("/api/races", (req, resp) => {
  provider.retrieveRaces(req, resp);
});

app.get("/api/races/:year/:round", (req, resp) => {
  provider.retrieveRaceByYearRound(req, resp);
});

app.get("/api/races/circuits/:ref", (req, resp) => {
  provider.retrieveRacesByCircuitRef(req, resp);
});

app.get("/api/races/season/:year/:round", (req, resp) => {
  provider.retrieveRaceByYearRound(req, resp);
});

app.get("/api/races/season/:year", (req, resp) => {
  provider.retrieveRacesBySeason(req, resp);
});

// Driver URLs
app.get("/api/drivers", (req, resp) => {
  provider.retrieveDrivers(req, resp);
});

app.get("/api/drivers/:ref", (req, resp) => {
  provider.retrieveDriverByRef(req, resp);
});

app.get("/api/drivers/ref/:ref", (req, resp) => {
  provider.retrieveDriverByRef(req, resp);
});

// Constructor URLs
app.get("/api/constructors", (req, resp) => {
  provider.retrieveConstructors(req, resp);
});

app.get("/api/constructors/:ref", (req, resp) => {
  provider.retrieveConstructorByRef(req, resp);
});

app.get("/api/constructors/ref/:ref", (req, resp) => {
  provider.retrieveConstructorByRef(req, resp);
});

// Default response for anything else
app.use(function (req, res) {
  res.status(404).json({ error: "URL not found" });
});

let port = 8080;
app.listen(port, () => {
  console.log("Server running at port= " + port);
  console.log("http://localhost:8080/");
});
