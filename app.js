const express = require('express');
const port = process.env.PORT || 3000; // this is our port nummber
const path = require('path');
const app = express(); // this is our app or instance of express

// API Middelwares
app.use(express.json()); // this is to aeccpt data in json format
app.use(express.urlencoded()); // this is basically to decode the data send through html form
app.use(express.static('public')); //this is server our public folder as a static folder

// API ROUTES
app.get('/form' , (req,res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.post('/formPost' , (req,res) => {
    console.log(req.body); // the data we get is in the body of request

    // Use path.join to construct the correct path
    const thanksFilePath = path.join(__dirname, '/public/Thanks.html');
    res.sendFile(thanksFilePath);
});

// this is basically to listen on port
app.listen(port , () => {
    console.log(`Server started at http://localhost:${port}`)
});