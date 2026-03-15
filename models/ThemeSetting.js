import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  primaryColor: { type: String, default: "#1F6728" },
  secondaryColor: { type: String, default: "#E8F5E9" },
  accentColor: { type: String, default: "#123F18" },
  backgroundColor: { type: String, default: "#F1F8F4" },
  sidebarColor: { type: String, default: "#E3EFE8" },
  foregroundColor: { type: String, default: "#2B4B3F" },
  animationVideoUrl: { type: String, default: null },
  animations: {
    type: { type: String, default: "none" },
    duration: { type: Number, default: 0.5 },
    enabled: { type: Boolean, default: false },
  },
}, { _id: false });

const textSchema = new mongoose.Schema({
  content: { type: String, default: "" },
  position: { type: String, default: "top" },
  color: { type: String, default: "#FFFFFF" },
}, { _id: false });

const buttonSchema = new mongoose.Schema({
  position: { type: String, default: "center" },
  text: { type: String, default: "Shop Now" },
  bgColor: { type: String, default: "#000000" },
  textColor: { type: String, default: "#FFFFFF" },
  category: { type: String, default: "" }
}, { _id: false });

const categoryThemeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  icon: { type: String, default: "ri-star-line" },
  color: { type: String, default: "#FFFFFF" },
  gif: { type: String, default: null },
  gifPreview: { type: String, default: null },
}, { _id: false });

const trendingPosterSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  category: { type: String, default: "" },
  icon: { type: String, default: "ri-star-line" },
  bgColor: { type: String, default: "#F5F5F5" },
}, { _id: false });

const promotionPosterSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  imagePreview: { type: String, default: null },
  button: { type: buttonSchema, default: () => ({}) },
}, { _id: false });

const featuredCampaignSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  imagePreview: { type: String, default: null },
  text: { type: textSchema, default: () => ({}) },
}, { _id: false });

const posterSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, default: "" },
  imagePreview: { type: String, default: null }
}, { _id: false });

const homeSchema = new mongoose.Schema({
  categoryThemes: [categoryThemeSchema],
  trendingPosters: [trendingPosterSchema],
  promotionPosters: [promotionPosterSchema],
  featuredCampaigns: [featuredCampaignSchema],
}, { _id: false });

const themeSettingSchema = new mongoose.Schema({
  color: { type: colorSchema, default: () => ({}) },
  home: { type: homeSchema, default: () => ({}) },
  posters: { type: [posterSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("theme_setting", themeSettingSchema);
