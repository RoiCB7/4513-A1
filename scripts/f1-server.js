const path = require("path"); 
// the verbose is optional but gives better error messages 
const sqlite3 = require("sqlite3").verbose();

// open the database 
const DB_PATH = path.join(__dirname, "../data/f1.db"); 
const db = new sqlite3.Database(DB_PATH);

// Helper function for database errors
const handleDatabaseError = (err, resp) => {
  console.error(err);
  resp.json({ error: 'Database error' });
}; 

// Get all circuits
const retrieveCircuits = (req, resp) => {
  const sql = `SELECT * FROM circuits`;
  db.all(sql, [], (err, rows) => { 
      if (err) { 
          handleDatabaseError(err, resp);
          return;
      } 
      resp.json(rows); 
  }); 
};
 
// Retrieve a single circuit based on the id parameter
const retrieveSingleCircuit = (req, resp) => {
    const sql = `SELECT * FROM circuits WHERE circuitId = ?`; 
    db.get(sql, [req.params.id], (err, row) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        if (!row) {
            resp.json({ error: 'Circuit not found' });
            return;
        }
        resp.json(row); 
    }); 
};

// Get circuit by reference parameter
const retrieveCircuitByRef = (req, resp) => {
    const ref = req.params.ref || req.params.param; // Handle both parameter names
    const sql = `SELECT * FROM circuits WHERE circuitRef = ?`; 
    db.get(sql, [ref], (err, row) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        if (!row) {
            resp.json({ error: 'Circuit not found' });
            return;
        }
        resp.json(row); 
    }); 
};

// Get all races for a specific circuit by circuit reference parameter
const retrieveRacesByCircuitRef = (req, resp) => {
    const sql = `
        SELECT r.*, c.name as circuitName, c.location, c.country 
        FROM races r 
        JOIN circuits c ON r.circuitId = c.circuitId 
        WHERE c.circuitRef = ? 
        ORDER BY r.year DESC, r.round ASC
    `; 
    db.all(sql, [req.params.ref], (err, rows) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        if (!rows || rows.length === 0) {
            resp.json({ error: 'No races found for this circuit' });
            return;
        }
        resp.json(rows); 
    }); 
};

// Get all drivers
const retrieveDrivers = (req, resp) => {
    const sql = `SELECT * FROM drivers ORDER BY surname, forename`;
    db.all(sql, [], (err, rows) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        resp.json(rows); 
    }); 
};

// Get driver by reference parameter
const retrieveDriverByRef = (req, resp) => {
    const sql = `SELECT * FROM drivers WHERE driverRef = ?`; 
    db.get(sql, [req.params.ref], (err, row) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        if (!row) {
            resp.json({ error: 'Driver not found' });
            return;
        }
        resp.json(row); 
    }); 
};

// Get all constructors
const retrieveConstructors = (req, resp) => {
    const sql = `SELECT * FROM constructors ORDER BY name`;
    db.all(sql, [], (err, rows) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        resp.json(rows); 
    }); 
};

// Get constructor by reference parameter
const retrieveConstructorByRef = (req, resp) => {
    const sql = `SELECT * FROM constructors WHERE constructorRef = ?`; 
    db.get(sql, [req.params.ref], (err, row) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        if (!row) {
            resp.json({ error: 'Constructor not found' });
            return;
        }
        resp.json(row); 
    }); 
};

// Get all races
const retrieveRaces = (req, resp) => {
    const sql = `
        SELECT r.*, c.name as circuitName, c.location, c.country 
        FROM races r 
        JOIN circuits c ON r.circuitId = c.circuitId 
        ORDER BY r.year DESC, r.round ASC
    `;
    db.all(sql, [], (err, rows) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        resp.json(rows); 
    }); 
};

// Get race by year and round parameters
const retrieveRaceByYearRound = (req, resp) => {
    const sql = `
        SELECT r.*, c.name as circuitName, c.location, c.country 
        FROM races r 
        JOIN circuits c ON r.circuitId = c.circuitId 
        WHERE r.year = ? AND r.round = ?
    `; 
    db.get(sql, [req.params.year, req.params.round], (err, row) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        if (!row) {
            resp.json({ error: 'Race not found' });
            return;
        }
        resp.json(row); 
    }); 
};

// Get all races for a specific year/season
const retrieveRacesBySeason = (req, resp) => {
    const sql = `
        SELECT r.*, c.name as circuitName, c.location, c.country 
        FROM races r 
        JOIN circuits c ON r.circuitId = c.circuitId 
        WHERE r.year = ? 
        ORDER BY r.round ASC
    `; 
    db.all(sql, [req.params.year], (err, rows) => { 
        if (err) { 
            handleDatabaseError(err, resp);
            return;
        } 
        if (!rows || rows.length === 0) {
            resp.json({ error: 'No races found for this season' });
            return;
        }
        resp.json(rows); 
    }); 
};

module.exports = {
  retrieveCircuits,
  retrieveSingleCircuit,
  retrieveCircuitByRef,
  retrieveRacesByCircuitRef,
  retrieveDrivers,
  retrieveDriverByRef,
  retrieveConstructors,
  retrieveConstructorByRef,
  retrieveRaces,
  retrieveRaceByYearRound,
  retrieveRacesBySeason,
};
            