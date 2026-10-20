const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Atlas Connected... FoodNest is live!");
        try {
            const { seedDefaultSubCategories } = require('../controllers/subCategoryController');
            await seedDefaultSubCategories();
        } catch (seedErr) {
            console.error("Subcategory seed warning:", seedErr.message);
        }
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;