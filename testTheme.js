import mongoose from "mongoose";
import { dbConnect } from "./database.js";
import ThemeSetting from "./models/ThemeSetting.js";
import dotEnv from "dotenv";
dotEnv.config();

const run = async () => {
  await dbConnect();
  let theme = await ThemeSetting.findOne();
  if(!theme) {
    theme = await ThemeSetting.create({});
    console.log("Created ThemeSetting:", theme);
  } else {
    console.log("Found ThemeSetting:", theme);
  }
  process.exit(0);
}
run();
