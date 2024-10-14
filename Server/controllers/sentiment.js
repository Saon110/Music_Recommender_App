const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();


function calculateSentiment(review) {
    // Lexical conversion
    const lexedReview = aposToLexForm(review);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    // Tokenization
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    // Spell correction
    const correctedReview = tokenizedReview.map(word => spellCorrector.correct(word));

    // Stop word removal
    const filteredReview = SW.removeStopwords(correctedReview);

    // Sentiment analysis
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);

    return analysis; // Return the sentiment score
}

module.exports = { calculateSentiment };

