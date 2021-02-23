const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers")
const Campground = require("../models/campground");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]; 

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //Your User ID
            author: "6030ccf1158caf09b869d36d",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: "https://source.unsplash.com/collection/483251",
            description: "Such a wonderful view.",
            price,
            geometry : { 
                type : "Point",
                coordinates : [ -105.277356, 40.015417 ]
                },
            images: [
                {
                    url: 'https://res.cloudinary.com/gafcu16/image/upload/v1614066487/YelpCamp/Sunshine_Camground_ewzuqu.jpg',
                    filename: 'YelpCamp/t7alaivcvjklzpfl50dr'
                },
                {
                    url: 'https://res.cloudinary.com/gafcu16/image/upload/v1614071235/YelpCamp/xvrtjewlf6rjlvbj6u5o.jpg',
                    filename: 'YelpCamp/xvrtjewlf6rjlvbj6u5o'
                }
            
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})