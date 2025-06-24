import mongoose from "mongoose";
import dotenv from "dotenv";
import Icon from "../models/icon.model.js";
import { DB_NAME } from "../constants.js";

dotenv.config();

const icons = [
  {
    name: "Salary",
    url: "https://api.iconify.design/mdi:briefcase-outline.svg",
    tags: ["salary", "income", "job"],
    type: "category",
  },
  {
    name: "Gift",
    url: "https://api.iconify.design/mdi:gift-outline.svg",
    tags: ["gift", "present", "bonus"],
    type: "category",
  },
  {
    name: "Food",
    url: "https://api.iconify.design/mdi:food.svg",
    tags: ["food", "meal", "restaurant"],
    type: "category",
  },
  {
    name: "Groceries",
    url: "https://api.iconify.design/mdi:basket-outline.svg",
    tags: ["grocery", "market", "home"],
    type: "category",
  },
  {
    name: "Shopping",
    url: "https://api.iconify.design/mdi:shopping-outline.svg",
    tags: ["shopping", "buy", "clothes"],
    type: "category",
  },
  {
    name: "Rent",
    url: "https://api.iconify.design/mdi:home-outline.svg",
    tags: ["rent", "house", "apartment"],
    type: "category",
  },
  {
    name: "Utilities",
    url: "https://api.iconify.design/mdi:flash-outline.svg",
    tags: ["electricity", "water", "gas"],
    type: "category",
  },
  {
    name: "Internet",
    url: "https://api.iconify.design/mdi:wifi.svg",
    tags: ["wifi", "broadband", "internet"],
    type: "category",
  },
  {
    name: "Mobile Recharge",
    url: "https://api.iconify.design/mdi:cellphone.svg",
    tags: ["recharge", "mobile", "phone"],
    type: "category",
  },
  {
    name: "Fuel",
    url: "https://api.iconify.design/mdi:gas-station-outline.svg",
    tags: ["fuel", "petrol", "diesel"],
    type: "category",
  },
  {
    name: "Transport",
    url: "https://api.iconify.design/mdi:car-outline.svg",
    tags: ["transport", "car", "commute"],
    type: "category",
  },
  {
    name: "Travel",
    url: "https://api.iconify.design/mdi:airplane-variant.svg",
    tags: ["travel", "flight", "trip"],
    type: "category",
  },
  {
    name: "Hotel",
    url: "https://api.iconify.design/mdi:bed-outline.svg",
    tags: ["hotel", "stay", "room"],
    type: "category",
  },
  {
    name: "Entertainment",
    url: "https://api.iconify.design/mdi:movie-outline.svg",
    tags: ["movie", "entertainment", "netflix"],
    type: "category",
  },
  {
    name: "Subscription",
    url: "https://api.iconify.design/mdi:repeat.svg",
    tags: ["subscription", "netflix", "spotify"],
    type: "category",
  },
  {
    name: "Health",
    url: "https://api.iconify.design/mdi:heart-pulse.svg",
    tags: ["health", "doctor", "medicine"],
    type: "category",
  },
  {
    name: "Pharmacy",
    url: "https://api.iconify.design/mdi:pill.svg",
    tags: ["pharmacy", "medicine", "health"],
    type: "category",
  },
  {
    name: "Education",
    url: "https://api.iconify.design/mdi:book-outline.svg",
    tags: ["education", "school", "tuition"],
    type: "category",
  },
  {
    name: "Loan EMI",
    url: "https://api.iconify.design/mdi:bank-outline.svg",
    tags: ["loan", "emi", "debt"],
    type: "category",
  },
  {
    name: "Investment",
    url: "https://api.iconify.design/mdi:chart-line.svg",
    tags: ["investment", "stocks", "mutual fund"],
    type: "category",
  },
  {
    name: "Insurance",
    url: "https://api.iconify.design/mdi:shield-check-outline.svg",
    tags: ["insurance", "cover", "plan"],
    type: "category",
  },
  {
    name: "Freelance",
    url: "https://api.iconify.design/mdi:laptop.svg",
    tags: ["freelance", "side-job", "project"],
    type: "category",
  },
  {
    name: "Bonus",
    url: "https://api.iconify.design/mdi:cash-plus.svg",
    tags: ["bonus", "extra", "reward"],
    type: "category",
  },
  {
    name: "Refund",
    url: "https://api.iconify.design/mdi:cash-refund.svg",
    tags: ["refund", "return", "cashback"],
    type: "category",
  },
  {
    name: "Charity",
    url: "https://api.iconify.design/mdi:hand-heart-outline.svg",
    tags: ["charity", "donate", "help"],
    type: "category",
  },
  {
    name: "Childcare",
    url: "https://api.iconify.design/mdi:baby-face-outline.svg",
    tags: ["baby", "kids", "childcare"],
    type: "category",
  },
  {
    name: "Pet",
    url: "https://api.iconify.design/mdi:paw-outline.svg",
    tags: ["pet", "dog", "cat"],
    type: "category",
  },
  {
    name: "Beauty",
    url: "https://api.iconify.design/mdi:lipstick.svg",
    tags: ["beauty", "makeup", "cosmetic"],
    type: "category",
  },
  {
    name: "Laundry",
    url: "https://api.iconify.design/mdi:washing-machine.svg",
    tags: ["laundry", "clothes", "wash"],
    type: "category",
  },
  {
    name: "Maintenance",
    url: "https://api.iconify.design/mdi:tools.svg",
    tags: ["maintenance", "repair", "service"],
    type: "category",
  },
  {
    name: "Other",
    url: "https://api.iconify.design/mdi:shape-outline.svg",
    tags: ["other", "misc", "extra"],
    type: "category",
  },
  {
    name: "Wallet",
    url: "https://api.iconify.design/mdi:wallet-outline.svg",
    tags: ["wallet", "money", "cash"],
    type: "account",
  },
  {
    name: "Bank",
    url: "https://api.iconify.design/mdi:bank-outline.svg",
    tags: ["bank", "finance", "account"],
    type: "account",
  },
  {
    name: "Cash",
    url: "https://api.iconify.design/mdi:cash.svg",
    tags: ["cash", "currency", "hand money"],
    type: "account",
  },
  {
    name: "Credit Card",
    url: "https://api.iconify.design/mdi:credit-card-outline.svg",
    tags: ["credit", "card", "payment"],
    type: "account",
  },
  {
    name: "Savings",
    url: "https://api.iconify.design/mdi:piggy-bank-outline.svg",
    tags: ["savings", "bank", "safe"],
    type: "account",
  },
  {
    name: "Paytm",
    url: "https://api.iconify.design/mdi:cellphone-nfc.svg",
    tags: ["paytm", "digital", "upi"],
    type: "account",
  },
  {
    name: "Google Pay",
    url: "https://api.iconify.design/mdi:contactless-payment.svg",
    tags: ["gpay", "tap", "mobile pay"],
    type: "account",
  },
  {
    name: "PhonePe",
    url: "https://api.iconify.design/mdi:cellphone-sound.svg",
    tags: ["phonepe", "wallet", "digital"],
    type: "account",
  },
  {
    name: "Crypto Wallet",
    url: "https://api.iconify.design/mdi:bitcoin.svg",
    tags: ["crypto", "bitcoin", "wallet"],
    type: "account",
  },
  {
    name: "Investments",
    url: "https://api.iconify.design/mdi:chart-bar.svg",
    tags: ["investment", "stocks", "money"],
    type: "account",
  },
];

const seedIcons = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    await Icon.deleteMany();
    await Icon.insertMany(icons);
    console.log("✅ Icons seeded");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding icons:", err);
    process.exit(1);
  }
};

seedIcons();
