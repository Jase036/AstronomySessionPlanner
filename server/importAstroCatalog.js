// import Mongo driver, options and dotenv
const {MongoClient} = require('mongodb');

require('dotenv').config();
const {MONGO_URI} = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//import node fetch
const fetch = (...args) => import('node-fetch')
.then(({default: fetch}) => fetch(...args));

//grabs the astro catalog from the public API sets the _id,  
//adds a link to more info in the object and uploads it to Mongo
// One time use...
const importAstroCatalog = async () => {
    try {
        
        const astroCatalog = "https://www.datastro.eu/api/records/1.0/search/?dataset=ngc-ic-messier-catalog&q=&rows=400&sort=-v_mag&facet=catalog&facet=object_definition&facet=const&facet=hubble"
        const response = await fetch(astroCatalog);
        const rawAstroData = await response.json();

        const astroData = rawAstroData.records.map((e) => ({...e, _id: e.recordid,  web: `http://spider.seds.org/ngc/ngc.cgi?CatalogNumber=${e.fields.name}`}));

        // creates a new client
        const client = new MongoClient(MONGO_URI, options);
    
        // connect to the client
        await client.connect();
    
        // connect to the database 
        const db = client.db('AstroPlanner');
        console.log("connected!");
        
        // add items and company data
        await db.collection("catalog").insertMany(astroData);
        
        
        console.log('Successfully added astro catalog');
        
        client.close();
        
        
    }

    catch (err) {
        console.log("Shit hit the fan - " + err.message);
    }
    
};

importAstroCatalog();
