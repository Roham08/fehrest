const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Sample price list data
let priceList = [
    {
        code: "010101",
        description: "تخریب کلی ساختمان‌های خشتی، گلی و چینه‌ای",
        unit: "مترمربع",
        unit_price: 850000
    },
    {
        code: "010102",
        description: "تخریب کلی ساختمان‌های آجری، سنگی و بلوکی با ملات‌های مختلف",
        unit: "مترمربع",
        unit_price: 980000
    }
];

// Routes
app.get('/api/pricelist', (req, res) => {
    res.json(priceList);
});

app.post('/api/pricelist', (req, res) => {
    const newItem = req.body;
    if (!newItem.code || !newItem.description || !newItem.unit || !newItem.unit_price) {
        return res.status(400).json({ error: 'همه فیلدها الزامی هستند' });
    }
    priceList.push(newItem);
    res.status(201).json(newItem);
});

app.put('/api/pricelist/:code', (req, res) => {
    const { code } = req.params;
    const updatedItem = req.body;
    const index = priceList.findIndex(item => item.code === code);
    
    if (index === -1) {
        return res.status(404).json({ error: 'آیتم مورد نظر یافت نشد' });
    }
    
    priceList[index] = { ...priceList[index], ...updatedItem };
    res.json(priceList[index]);
});

app.delete('/api/pricelist/:code', (req, res) => {
    const { code } = req.params;
    const index = priceList.findIndex(item => item.code === code);
    
    if (index === -1) {
        return res.status(404).json({ error: 'آیتم مورد نظر یافت نشد' });
    }
    
    priceList.splice(index, 1);
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'خطای سرور رخ داده است' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`سرور در پورت ${PORT} در حال اجراست`);
});
