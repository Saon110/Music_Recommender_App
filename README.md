To run the backend:
1) Clone the repo
2) Run in terminal : npm install
3) To successfully run the server, you have to create a sptify developer account in spotify and login. Then you hae to create an app there. Then you will get a clientId and clientSecret
   which you will use in spotify.js file to authenticate spotify api request.
5) Run : npm start
6) To test the api, create a post request in Postman : "localhost:5000/getSong".
   In the body, send a form data having a key called 'image' and a value which is the image you want to analyze.
