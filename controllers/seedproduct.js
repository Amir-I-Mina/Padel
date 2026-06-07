const mongoose = require('mongoose');
const Product = require('./models/ProductSchema');

const dbURI = 'mongodb://Padelweb:padel12345@ac-tgk4oui-shard-00-00.dfnd8so.mongodb.net:27017,ac-tgk4oui-shard-00-01.dfnd8so.mongodb.net:27017,ac-tgk4oui-shard-00-02.dfnd8so.mongodb.net:27017/?ssl=true&replicaSet=atlas-57qqm7-shard-0&authSource=admin&appName=PadelWebDatabase';

const products = [
    {
        name: 'Pro Carbon Padel Racket',
        price: 1000,
        desc: 'Professional-grade carbon fiber racket for advanced players',
        category: 'rackets',
        hasOptions: false,
        inStock: true,
        image: '/images/placeholder.png'
    },
    {
        name: 'Premium Ball Pack (3 Cans)',
        price: 350,
        desc: 'Official padel balls, pressure-sealed for long lasting performance',
        category: 'balls',
        hasOptions: false,
        inStock: true,
        image: '/images/placeholder.png'
    },
    {
        name: 'Elite Padel Sport Kit',
        price: 1500,
        desc: 'Complete sport kit, breathable fabric for maximum comfort',
        category: 'clothing',
        hasOptions: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy'],
        inStock: true,
        image: '/images/placeholder.png'
    }
];

mongoose.connect(dbURI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('✅ Products added successfully!');
        process.exit();
    })
    .catch(err => {
        console.log(err);
        process.exit();
    });