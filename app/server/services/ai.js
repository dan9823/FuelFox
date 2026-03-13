const OpenAI = require('openai');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

let _openai;
function getClient() {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      throw new Error('OPENAI_API_KEY is not configured. Set it in server/.env');
    }
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}
const model = process.env.OPENAI_MODEL || 'gpt-4o';

async function imageToBase64(filePath) {
  const buffer = await sharp(filePath)
    .resize({ width: 1024, height: 1024, fit: 'inside' })
    .jpeg({ quality: 85 })
    .toBuffer();
  return buffer.toString('base64');
}

async function analyzeMeal(filePath) {
  const base64 = await imageToBase64(filePath);

  const response = await getClient().chat.completions.create({
    model,
    temperature: 0.3,
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: `You are a nutrition analysis AI. Analyze food photos and return ONLY valid JSON.
Be conservative with calorie estimates — when uncertain, estimate on the lower end.
Use standard portion sizes. Include a confidence score (0-1) for each item.
If no food is detected in the image, return: {"items":[],"mealType":"unknown","notes":"No food detected"}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this meal photo. Return JSON in this exact format:
{
  "items": [
    {
      "name": "food name",
      "portion": "e.g. 1 cup, 100g, 1 medium",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0,
      "confidence": 0.0
    }
  ],
  "mealType": "breakfast|lunch|dinner|snack",
  "notes": "optional brief note"
}`,
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${base64}`, detail: 'high' },
          },
        ],
      },
    ],
  });

  const text = response.choices[0].message.content.trim();
  // Extract JSON from potential markdown code fences
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  return JSON.parse(jsonMatch[1].trim());
}

async function analyzeLabel(filePath) {
  const base64 = await imageToBase64(filePath);

  const response = await getClient().chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: `You are a nutrition label reader AI. Extract nutritional information from food packaging labels and return ONLY valid JSON.
Be precise — read the exact values from the label. Include a confidence score (0-1).
If no nutrition label is detected, return: {"product":{"name":"Unknown","servingSize":"N/A","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"sugar":0,"sodium":0},"confidence":0,"notes":"No nutrition label detected"}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Read the nutrition label in this image. Return JSON in this exact format:
{
  "product": {
    "name": "product name",
    "servingSize": "e.g. 1 cup (240ml)",
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "fiber": 0,
    "sugar": 0,
    "sodium": 0
  },
  "confidence": 0.0,
  "notes": "optional brief note"
}`,
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${base64}`, detail: 'high' },
          },
        ],
      },
    ],
  });

  const text = response.choices[0].message.content.trim();
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  return JSON.parse(jsonMatch[1].trim());
}

module.exports = { analyzeMeal, analyzeLabel };
