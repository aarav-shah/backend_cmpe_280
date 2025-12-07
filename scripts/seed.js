import { getEmbedding } from "../services/jina.js";
import { deleteCollection, ensureCollection, insertToQdrant } from "../services/qdrant.js";

const dummyData = [
  {
    id: 1,
    title: "Healthy Eating Tips",
    content: "Incorporate more fruits, vegetables, and whole grains into your daily meals to maintain optimal health."
  },
  {
    id: 2,
    title: "Benefits of Regular Exercise",
    content: "Engaging in at least 30 minutes of physical activity daily can improve cardiovascular health and boost mood."
  },
  {
    id: 3,
    title: "Importance of Sleep",
    content: "Aim for 7-9 hours of quality sleep each night to support mental clarity, immune function, and overall wellbeing."
  },
  {
    id: 4,
    title: "Hydration for Wellness",
    content: "Drink at least 8 glasses of water a day to promote kidney function, skin health, and energy levels."
  },
  {
    id: 5,
    title: "Stress Management",
    content: "Practice mindfulness, meditation, or breathing exercises to reduce stress and improve emotional resilience."
  },
  {
    id: 6,
    title: "Heart Health Tips",
    content: "Limit saturated fats, avoid trans fats, and include more omega-3 rich foods in your diet to protect your heart."
  },
  {
    id: 7,
    title: "Boosting Immunity",
    content: "Consume vitamin-rich foods like citrus fruits and leafy greens, and exercise regularly to strengthen your immune system."
  },
  {
    id: 8,
    title: "Safe Sun Exposure",
    content: "Wear sunscreen, protective clothing, and avoid peak sun hours to reduce skin cancer risk."
  },
  {
    id: 9,
    title: "Healthy Weight Management",
    content: "Balance calorie intake with physical activity, and choose nutrient-dense foods over processed snacks."
  },
  {
    id: 10,
    title: "Mental Wellness",
    content: "Stay connected with loved ones, pursue hobbies, and seek help when feeling overwhelmed or anxious."
  }
];

const healthProducts = [
  {
    id: 1,
    name: "Vitamin D Supplement",
    description: "Supports bone health and immune function. Recommended for individuals with low sun exposure.",
    category: "Supplement",
    usage: "Take one tablet daily with food.",
  },
  {
    id: 2,
    name: "Blood Pressure Monitor",
    description: "Digital device for monitoring blood pressure at home. Useful for hypertension management.",
    category: "Device",
    usage: "Wrap cuff around arm and press start. Record readings regularly.",
  },
  {
    id: 3,
    name: "Omega-3 Fish Oil",
    description: "Promotes heart health and reduces inflammation. Sourced from deep-sea fish.",
    category: "Supplement",
    usage: "Take one capsule twice daily after meals.",
  },
  {
    id: 4,
    name: "Reusable Face Mask",
    description: "Protects against airborne particles and viruses. Washable and eco-friendly.",
    category: "Protective Gear",
    usage: "Wear over nose and mouth in public spaces. Wash after each use.",
  },
  {
    id: 5,
    name: "Probiotic Yogurt",
    description: "Improves gut health and digestion. Contains live probiotic cultures.",
    category: "Food",
    usage: "Consume one cup daily as part of breakfast or snack.",
  },
  {
    id: 6,
    name: "Hand Sanitizer Gel",
    description: "Kills 99.9% of germs. Contains moisturizing agents to prevent dry skin.",
    category: "Hygiene",
    usage: "Apply a small amount to hands and rub until dry.",
  },
  {
    id: 7,
    name: "Multivitamin Tablets",
    description: "Provides essential vitamins and minerals for overall health.",
    category: "Supplement",
    usage: "Take one tablet daily with water.",
  },
  {
    id: 8,
    name: "Fitness Tracker",
    description: "Wearable device to track steps, heart rate, and sleep patterns.",
    category: "Device",
    usage: "Wear on wrist. Sync data with mobile app for insights.",
  },
  {
    id: 9,
    name: "Allergy Relief Tablets",
    description: "Relieves symptoms of seasonal allergies. Non-drowsy formula.",
    category: "Medicine",
    usage: "Take one tablet as needed for allergy symptoms.",
  },
  {
    id: 10,
    name: "Electric Toothbrush",
    description: "Improves oral hygiene with advanced cleaning technology.",
    category: "Device",
    usage: "Brush teeth twice daily for two minutes each session.",
  },
];


await ensureCollection("HealthInfo");
await ensureCollection("HealthProducts");

for (const item of dummyData) {
  const vector = await getEmbedding(item.content);
  await insertToQdrant("HealthInfo", item.id, vector, item);
}

for (const product of healthProducts) {
  const vector = await getEmbedding(product.description);
  await insertToQdrant("HealthProducts", product.id, vector, product);
}

console.log("Seeding completed.");