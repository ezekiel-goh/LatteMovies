function generateRandomData() {
  var pairs = [];

  while (pairs.length < 100) {
    var timestampInSeconds = Math.floor(Math.random() * 41) * 3;
    var randomId = Math.floor(Math.random() * 6) + 1;
    var minutes = Math.floor(timestampInSeconds / 60);
    var seconds = timestampInSeconds % 60;
    var formattedTimestamp = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    var pair = {
      userId: randomId,
      timestamp: formattedTimestamp
    };

    var pairExists = pairs.some(function(existingPair) {
      return existingPair.userId === pair.userId && existingPair.timestamp === pair.timestamp;
    });

    if (!pairExists) {
      pairs.push(pair);
    }
  }

  return pairs;
}

async function insertData(data) {
  try {
    const query = 'INSERT INTO Views (UserID, Timestamp) VALUES ?';

    const values = data.map(pair => [pair.userId, pair.timestamp]);

    const [result] = await pool.query(query, [values]);

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// Function to retrieve data from the database and generate histogram data
async function generateHistogramData(callback) {
  try {
    const query = 'SELECT Timestamp, COUNT(DISTINCT UserID) AS views FROM Views GROUP BY Timestamp ORDER BY Timestamp';

    const [results] = await pool.query(query);

    console.log('Data retrieved successfully!');

    const histogramData = results.map(row => ({
      timestamp: row.timestamp,
      views: row.views
    }));

    callback(histogramData);
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
}

function renderHistogram(histogramData) {
  // Get the canvas element from your HTML where you want to render the histogram
  var canvas = document.getElementById('viewsHistogram');

  // Extract the timestamp labels and views data from the histogramData
  var labels = histogramData.map(function(data) {
    return data.timestamp;
  });

  var views = histogramData.map(function(data) {
    return data.views;
  });

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Views',
          data: views,
          backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue color
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
          stepSize: 1
        }
      }
    }
  });
}

module.exports = { generateRandomData, insertData, generateHistogramData, renderHistogram };