const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

let db;

async function initializeDatabase() {
  db = await open({
    filename: ':memory:',
    driver: sqlite3.Database,
  });

  await createTables();
  await loadData();
}

async function createTables() {
  await db.exec(`
    CREATE TABLE movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      title TEXT,
      studios TEXT,
      winner BOOLEAN
    );
  `);

  await db.exec(`
    CREATE TABLE producers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER,
      name TEXT,
      FOREIGN KEY (movie_id) REFERENCES movies (id)
    );
  `);
}

async function loadData() {
  const csvPath = path.resolve(__dirname, '../data/movielist.csv');
  const movies = [];

  fs.createReadStream(csvPath)
    .pipe(csvParser({ separator: ';' }))
    .on('data', (row) => {
      movies.push({
        year: parseInt(row.year, 10),
        title: row.title,
        studios: row.studios,
        producers: row.producers,
        winner: row.winner === 'yes',
      });
    })
    .on('end', async () => {
      await insertMoviesAndProducers(movies);
      console.log('Database initialized with normalized producer data');
    });
}

async function insertMoviesAndProducers(movies) {
  const movieInsertStmt = `
    INSERT INTO movies (year, title, studios, winner)
    VALUES (?, ?, ?, ?);
  `;
  const producerInsertStmt = `
    INSERT INTO producers (movie_id, name)
    VALUES (?, ?);
  `;

  for (const movie of movies) {
    const result = await db.run(movieInsertStmt, [
      movie.year,
      movie.title,
      movie.studios,
      movie.winner,
    ]);
    const movieId = result.lastID;

    const producerList = movie.producers
      .split(/,\sAND\s|,|AND\s/i)
      .map((p) => p.trim());

    for (const producer of producerList) {
      await db.run(producerInsertStmt, [movieId, producer]);
    }
  }
}

async function getRepeatedProducers() {
    const query = `
    SELECT
      name AS producer,
      COUNT(*) AS movieCount
    FROM producers
    GROUP BY name
    HAVING COUNT(*) > 1
    ORDER BY movieCount DESC;
  `;
  
  return await db.all(query);
}

async function getProducerIntervals() {
    const query = `
    WITH ranked_producers AS (
      SELECT
        producers.name AS producer,
        movies.year AS year,
        RANK() OVER (PARTITION BY producers.name ORDER BY movies.year) AS rank
      FROM producers
      INNER JOIN movies ON producers.movie_id = movies.id
      WHERE movies.winner = 1
    )
    SELECT
      p1.producer,
      p1.year AS previousWin,
      p2.year AS followingWin,
      (p2.year - p1.year) AS interval
    FROM ranked_producers p1
    JOIN ranked_producers p2
      ON p1.producer = p2.producer AND p2.rank = p1.rank + 1
    ORDER BY interval DESC;
  `;

  return await db.all(query);
}


async function getAllProducers() {
  const query = `
    SELECT * FROM producers
    ORDER BY name ASC;
  `;
  
 return await db.all(query);
}
function getDatabase() {
  return db;
}

module.exports = { initializeDatabase, getDatabase, getRepeatedProducers, getProducerIntervals, getAllProducers };
