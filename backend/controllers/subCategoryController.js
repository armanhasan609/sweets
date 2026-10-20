const SubCategory = require('../models/SubCategory');

const DEFAULT_SUBCATEGORIES = [
    "Sweets & Mithai",
    "Cakes & Pastries",
    "Burgers & Sandwiches",
    "Pizza",
    "Momos & Rolls",
    "Snacks & Chaat",
    "Bakery Items",
    "Beverages",
    "Combos & Special Offers"
];

// Seed default subcategories if none exist
const seedDefaultSubCategories = async () => {
    try {
        const count = await SubCategory.countDocuments();
        if (count === 0) {
            const seedDocs = DEFAULT_SUBCATEGORIES.map(name => ({ name }));
            await SubCategory.insertMany(seedDocs, { ordered: false });
            console.log("✅ Seeded default food subcategories into database");
        }
    } catch (error) {
        console.error("Auto-seed default subcategories error:", error.message);
    }
};

// Create SubCategory
exports.createSubCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: "SubCategory name is required" });
        }

        const trimmedName = name.trim();
        const existing = await SubCategory.findOne({
            name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: "SubCategory already exists" });
        }

        const newSubCategory = new SubCategory({ name: trimmedName });
        await newSubCategory.save();

        res.status(201).json({ success: true, message: "SubCategory created successfully", subCategory: newSubCategory });
    } catch (error) {
        console.error("Create SubCategory Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All SubCategories
exports.getAllSubCategories = async (req, res) => {
    try {
        let subCategories = await SubCategory.find().sort({ name: 1 });

        // Auto-seed default subcategories if database has no subcategories
        if (!subCategories || subCategories.length === 0) {
            await seedDefaultSubCategories();
            subCategories = await SubCategory.find().sort({ name: 1 });
        }

        res.status(200).json({ success: true, subCategories });
    } catch (error) {
        console.error("Get SubCategories Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete SubCategory
exports.deleteSubCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: "SubCategory name is required" });
        }

        const trimmedName = name.trim();
        const deleted = await SubCategory.findOneAndDelete({
            name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "SubCategory not found in database" });
        }

        res.status(200).json({ success: true, message: "SubCategory deleted successfully" });
    } catch (error) {
        console.error("Delete SubCategory Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.seedDefaultSubCategories = seedDefaultSubCategories;

