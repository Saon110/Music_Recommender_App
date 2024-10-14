const fs = require('fs');
const csv = require('csv-parser');
const KNN = require('ml-knn');


let knnModel = null;  // Will hold the trained KNN model
let artistEncoder = {};  // Map for encoding artists
let titleEncoder = {};   // Map for encoding titles

// Load data and train model asynchronously using Promises
function loadDataAndTrainModel() {
    return new Promise((resolve, reject) => {
        const results = [];

        // Load data from CSV file
        fs.createReadStream('./song_sentiment_data_with_realistic_sentiment.csv')
            .pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                processData(results);  // Call processData to encode and train the model
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

function processData(results) {
    const X = [];  // Sentiment scores (features)
    const yArtist = [];  // Encoded artist names (labels)
    const yTitle = [];   // Encoded song titles (labels)

    results.forEach((row) => {
        const sentiment = parseFloat(row.sentiment);
        const artist = row.artist;
        const title = row.title;

        // Encode artist
        if (!artistEncoder[artist]) {
            artistEncoder[artist] = Object.keys(artistEncoder).length;
        }
        const artistEncoded = artistEncoder[artist];

        // Encode title
        if (!titleEncoder[title]) {
            titleEncoder[title] = Object.keys(titleEncoder).length;
        }
        const titleEncoded = titleEncoder[title];

        // Store the data
        X.push([sentiment]);  // Input feature for KNN should be 2D
        yArtist.push(artistEncoded);
        yTitle.push(titleEncoded);
    });

    // Train the KNN model using the entire dataset for artist prediction
    knnModel = new KNN(X, yArtist, { k: 1 });  // Set k = 1 for closest neighbor
    console.log('KNN model for artist trained successfully.');
}

function recommendSong(sentiment) {
    if (!knnModel) {
        throw new Error('Model not trained yet.');
    }

    // Predict the artist based on the sentiment score
    const artistPredictedEncoded = knnModel.predict([[sentiment]]);  // Predict the encoded artist
    const artistPredicted = Object.keys(artistEncoder).find(key => artistEncoder[key] === artistPredictedEncoded[0]);

    // Predict the title based on the artist (or you can use another KNN model for title)
    const titlePredicted = Object.keys(titleEncoder).find(key => titleEncoder[key] === artistPredictedEncoded[0]);

    return { artist: artistPredicted, title: titlePredicted };
}

module.exports = { loadDataAndTrainModel, recommendSong };