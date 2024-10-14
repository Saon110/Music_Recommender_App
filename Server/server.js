const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { upload, detectText } = require('./controllers/ocr');
const { calculateSentiment } = require('./controllers/sentiment');
const { loadDataAndTrainModel, recommendSong } = require('./controllers/model');
const { authenticateSpotify, getSpotifyUrl } = require('./controllers/spotify');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


app.post('/getSong', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = path.resolve(__dirname, req.file.path);

    try {
        const text = await detectText(imagePath);
        fs.unlinkSync(imagePath);  // Delete the uploaded
        const sentiment = calculateSentiment(text);
        console.log('Detected text:', text);
        console.log('Sentiment score:', sentiment);
        const { artist, title } = recommendSong(sentiment);
        const spotifyUrl = await getSpotifyUrl(artist, title);
        console.log('Recommended song:', artist, title, spotifyUrl);
        res.json({ artist, title, spotifyUrl });
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await authenticateSpotify();  // Authenticate Spotify when server starts
    loadDataAndTrainModel();
});