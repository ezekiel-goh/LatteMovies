const { query } = require('../database');

function insertData(req, res) {
  try {
    if (!req.body || !req.body.viewsData) {
      console.log('Missing viewsData in request body');
      res.sendStatus(400);
      return;
    }
    
    console.log(req.body.viewsData);
    const { viewsData } = req.body;
    console.log('Trying to insert data');

    const deleteSql = "DELETE FROM Views";
    const emptyViewsTable = query(deleteSql);

    const insertPromises = viewsData.map(({ userId, timestamp }) => {
      const sql = "INSERT INTO Views(UserID, Timestamp) VALUES (?, ?)";
      return query(sql, [userId, timestamp]);
    });

    Promise.all([emptyViewsTable, ...insertPromises]) // emptyViewsTable promise first, then concurrent request of insertPromises
      .then(() => {
        console.log('Data inserted successfully');
        res.sendStatus(200);
      })
      .catch(error => {
        console.log('Error inserting data:', error);
        res.sendStatus(500);
      });
  } catch (error) {
    console.log('Error inserting data:', error);
    res.sendStatus(500);
  }
}


function generateHistogramData(req, res) { // retrieving data from database for the histogram generation
  try {
    const queryStr = 'SELECT Timestamp, COUNT(DISTINCT UserID) AS views FROM Views GROUP BY Timestamp ORDER BY Timestamp'; // selecting timestamp first, then every unique userid for that timestamp to be as 1 view, totalling the views for that timestamp
    query(queryStr)
      .then(([results]) => {
        console.log('Data retrieved successfully!');
        const histogramData = results.map(row => ({ // sorting data retrieved
          timestamp: row.Timestamp,
          views: row.views
        }));
        res.json(histogramData);
      })
      .catch(error => {
        console.error('Error retrieving data:', error);
        res.sendStatus(500);
      });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.sendStatus(500);
  }
}

module.exports = { insertData, generateHistogramData };
