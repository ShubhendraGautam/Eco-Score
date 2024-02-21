const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const fs = require('fs');



const app = express()
const path = require('path');

app.set('views', __dirname + '/views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


// Define a port number
const PORT = 3000;


// Make a static route to use your static files in client side
app.use('/static', express.static('static'));


// Middleware for parsing
app.use(express.urlencoded());
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

// declare path on rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection
mongoose.connect(
	"mongodb://localhost:27017/ecoscore",
	{ useUnifiedTopology: true }
);

// Create schema
const feedSchecma = mongoose.Schema({
    name: String,
	carbonFootprint: Number,
	materialSourcing: Number,
    lifeSpan: Number,
	pollutionGradient: Number,
    ecoscore: Number
});

// Making a modal on our already defined schema
const feedModal = mongoose.model('table', feedSchecma);


app.get('/', (req, res)=>{
    res.status(200).render('index');
})



app.get('/index.ejs', (req, res)=>{ 
    res.status(200).render('index.ejs');
})


// app.get('/search.ejs', (req, res)=>{
//     const params = { "content": null};
//     res.status(200).render('searched.ejs',params);
// })


app.post('/searched.ejs', (req, res)=>{

    const itemName = req.body.search;
    // const params = { "content": con}
    var result;
    
    feedModal.find({ name: itemName}).exec()
    .then(docs => {
        const params = { "content": docs[0]}

        res.status(200).render('searched.ejs', params);
        if (docs.length > 0) {
            console.log('Item Details:');
            console.log('Name:', docs[0].name);
            console.log('carbonFootprint:', docs[0].carbonFootprint);
            console.log('materialSourcing:', docs[0].materialSourcing);
            console.log('lifeSpan:', docs[0].lifeSpan);
            console.log('pollutionGradient:', docs[0].pollutionGradient);
        } else {
            console.log('Item not found.');
        }

        
    })
    .catch(err => {
        console.error('Error:', err);
       
    });

})

app.get('/form.ejs', (req, res)=>{
    // const con = "This is the best content on the internet so far so use it wisely"
    // const params = {'title': 'PubG is the best game', "content": con}
    res.status(200).render('form.ejs');
})

app.get('/form1.ejs', (req, res)=>{
    // const con = "This is the best content on the internet so far so use it wisely"
    // const params = {'title': 'PubG is the best game', "content": con}
    res.status(200).render('form1.ejs');
})



app.post('/form1.ejs', (req, res) => {
    // Log the files to the console
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname+'/upload/' + image.name);

/**
    feedModal.find({ name: itemName}).exec()
    .then(docs => {  
        if (docs.length > 0) {
            console.log('Item Details:');
            console.log('Name:', docs[0].name);
            console.log('carbonFootprint:', docs[0].carbonFootprint);
            console.log('MS:', docs[0].ms);
            console.log('LS:', docs[0].ls);
            console.log('pollutionGradient:', docs[0].pollutionGradient);
        } else {
            console.log('Item not found.');
        }    
    })
    All good
try {
  fs.unlinkSync('/upload/' + image.name);

  console.log("Delete File successfully.");
} catch (error) {
  console.log(error);
}
**/

    res.sendStatus(200);
});


// Handling data after submission of form
app.post("/form.ejs", function (req, res) {

    var {name,carbonFootprint,materialSourcing,lifeSpan,pollutionGradient}=req.body;
	const feedData = new feedModal({
        name: name,
		carbonFootprint: carbonFootprint,
		materialSourcing: materialSourcing,
		lifeSpan: lifeSpan,
        pollutionGradient: pollutionGradient,

	});
	feedData.save().then(data => {
			res.render('form.ejs',{ msg: "Your feedback successfully saved." });
		})
		.catch(err => {
			res.render('form.ejs',{ msg: "Check Details." });
		});
})

// Server setup
app.listen(PORT, () => {
	console.log("Server is running on port ", PORT);
});
