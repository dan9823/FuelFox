const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const { analyzeMeal, analyzeLabel } = require('../services/ai');

const router = express.Router();

// Set up multer for image uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, HEIC, and WebP are allowed.'));
    }
  },
});

// Food estimation database for text search fallback
const FOOD_DATABASE = [
  { name: 'Grilled chicken breast', calories: 165, carbs: 0, fats: 3.6, proteins: 31, per: '100g' },
  { name: 'White rice', calories: 130, carbs: 28, fats: 0.3, proteins: 2.7, per: '100g' },
  { name: 'Steamed broccoli', calories: 35, carbs: 7, fats: 0.4, proteins: 2.4, per: '100g' },
  { name: 'Caesar salad', calories: 180, carbs: 8, fats: 14, proteins: 6, per: 'serving' },
  { name: 'Pasta with tomato sauce', calories: 320, carbs: 52, fats: 8, proteins: 12, per: 'serving' },
  { name: 'Avocado toast', calories: 280, carbs: 30, fats: 16, proteins: 8, per: 'slice' },
  { name: 'Banana', calories: 89, carbs: 23, fats: 0.3, proteins: 1.1, per: 'medium' },
  { name: 'Scrambled eggs', calories: 147, carbs: 1.6, fats: 10, proteins: 10, per: '2 eggs' },
  { name: 'Burger', calories: 540, carbs: 40, fats: 28, proteins: 30, per: 'serving' },
  { name: 'Pizza slice', calories: 285, carbs: 36, fats: 10, proteins: 12, per: 'slice' },
  { name: 'Sushi roll', calories: 255, carbs: 38, fats: 7, proteins: 9, per: '6 pieces' },
  { name: 'Smoothie', calories: 210, carbs: 42, fats: 2, proteins: 6, per: 'glass' },
  { name: 'Steak', calories: 271, carbs: 0, fats: 19, proteins: 26, per: '100g' },
  { name: 'Salmon fillet', calories: 208, carbs: 0, fats: 13, proteins: 20, per: '100g' },
  { name: 'Mixed salad', calories: 120, carbs: 12, fats: 6, proteins: 4, per: 'bowl' },
];

// Normalize AI response field names to match client conventions (fat→fats, protein→proteins)
function normalizeItem(item) {
  return {
    name: item.name,
    portion: item.portion,
    calories: item.calories || 0,
    carbs: item.carbs || 0,
    fats: item.fat != null ? item.fat : (item.fats || 0),
    proteins: item.protein != null ? item.protein : (item.proteins || 0),
    confidence: item.confidence || 0.5,
  };
}

function computeTotals(items) {
  return {
    calories: items.reduce((s, i) => s + i.calories, 0),
    carbs: items.reduce((s, i) => s + i.carbs, 0),
    fats: items.reduce((s, i) => s + i.fats, 0),
    proteins: items.reduce((s, i) => s + i.proteins, 0),
  };
}

function cleanupFile(filePath) {
  try { fs.unlinkSync(filePath); } catch (_) { /* ignore */ }
}

// POST /api/analyze/meal - Analyze a meal photo
router.post('/meal', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    const aiResult = await analyzeMeal(req.file.path);
    const items = (aiResult.items || []).map(normalizeItem);
    const totals = computeTotals(items);

    res.json({
      imageUrl: `/uploads/${req.file.filename}`,
      analysis: {
        items,
        totals,
        mealType: aiResult.mealType || 'snack',
        notes: aiResult.notes || '',
      },
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    cleanupFile(req.file.path);
    console.error('Meal analysis error:', err.message);
    res.status(500).json({ error: 'Failed to analyze meal photo. ' + err.message });
  }
});

// POST /api/analyze/label - Analyze a nutrition label
router.post('/label', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    const aiResult = await analyzeLabel(req.file.path);
    const product = aiResult.product || {};

    res.json({
      imageUrl: `/uploads/${req.file.filename}`,
      analysis: {
        product: {
          name: product.name || 'Unknown product',
          servingSize: product.servingSize || 'N/A',
          calories: product.calories || 0,
          carbs: product.carbs || 0,
          fats: product.fat != null ? product.fat : (product.fats || 0),
          proteins: product.protein != null ? product.protein : (product.proteins || 0),
          fiber: product.fiber || 0,
          sugar: product.sugar || 0,
          sodium: product.sodium || 0,
        },
        confidence: aiResult.confidence || 0.5,
        notes: aiResult.notes || '',
      },
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    cleanupFile(req.file.path);
    console.error('Label analysis error:', err.message);
    res.status(500).json({ error: 'Failed to analyze label. ' + err.message });
  }
});

// POST /api/analyze/text - Search food by text
router.post('/text', authMiddleware, (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const lowerQuery = query.toLowerCase();
  const matches = FOOD_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(lowerQuery)
  );

  if (matches.length === 0) {
    const estimated = {
      name: query,
      calories: 250 + Math.floor(Math.random() * 200),
      carbs: 20 + Math.floor(Math.random() * 30),
      fats: 8 + Math.floor(Math.random() * 15),
      proteins: 10 + Math.floor(Math.random() * 20),
      per: 'serving',
      isEstimate: true,
    };
    return res.json({ results: [estimated] });
  }

  res.json({ results: matches });
});

module.exports = router;
