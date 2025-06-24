import mongoose from "mongoose";
import dotenv from "dotenv";
import Color from "../models/color.model.js";
import { DB_NAME } from "../constants.js";

dotenv.config();

const colors = [
  {
    name: "Red",
    tailwindClass: "bg-red-500",
    hex: "#ef4444",
  },
  {
    name: "Blue",
    tailwindClass: "bg-blue-500",
    hex: "#3b82f6",
  },
  {
    name: "Green",
    tailwindClass: "bg-green-500",
    hex: "#22c55e",
  },
  {
    name: "Yellow",
    tailwindClass: "bg-yellow-500",
    hex: "#eab308",
  },
  {
    name: "Purple",
    tailwindClass: "bg-purple-500",
    hex: "#a855f7",
  },
  {
    name: "Pink",
    tailwindClass: "bg-pink-500",
    hex: "#ec4899",
  },
  {
    name: "Orange",
    tailwindClass: "bg-orange-500",
    hex: "#f97316",
  },
  {
    name: "Indigo",
    tailwindClass: "bg-indigo-500",
    hex: "#6366f1",
  },
  {
    name: "Teal",
    tailwindClass: "bg-teal-500",
    hex: "#14b8a6",
  },
  {
    name: "Slate",
    tailwindClass: "bg-slate-500",
    hex: "#64748b",
  },
];

const seedColors = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    await Color.deleteMany();
    await Color.insertMany(colors);
    console.log("✅ Colors seeded");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding colors:", err);
    process.exit(1);
  }
};

seedColors();
