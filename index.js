import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cron from "node-cron";
import { dbConnect } from "./database.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

// Routes
import userRouter from "./routes/userRoute.js";
import retailerRoute from "./routes/retailerRoute.js";
import storeRouter from "./routes/storeRouter.js";
import adminRouter from "./routes/adminRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import onlineStoreRouter from "./routes/onlineStoreRouter.js";
import reelRouter from "./routes/reelRouter.js";
import cropRouter from "./routes/cropRouter.js";
import chatRouter from "./routes/chatRouter.js";
import deliveryRouter from "./routes/deliveryRouter.js";
import shiprocketRouter from "./routes/shiprocketRouter.js";
import adminAgriAdviceRouter from "./routes/adminAgriAdvice.js";
import agriAdviceUserRouter from "./routes/agriAdviceUser.js";
import paymentRouter from "./routes/paymentRouter.js";
import sellerRouter from "./routes/sellerRouter.js";
import pickupAddressRouter from "./routes/pickupAddressRouter.js";
import superadminRouter from "./routes/superadminRouter.js";
import donationRoutes from "./routes/donationRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

import { checkPremiumExpiry, runAdsExpiryCron } from "./services.js";
import { isSocketAuthenticated } from "./middlewares/middleware.js";
import { createChat, getMessages, sendMessage } from "./controllers/chatController.js";
import { goOnlineSocket, goOfflineSocket } from "./controllers/DeliveryBoyController.js";
import { webhookTracking } from "./controllers/shiprocketController.js";
import { renderSharedProfilePage } from "./controllers/userController.js";
import { catchError } from "./helper/service.js";

dotEnv.config();

const app = express();
const port = process.env.PORT || 5000;
const enableChatSockets = process.env.ENABLE_CHAT_SOCKETS !== "false";

/* ------------------------------------------------------------------ */
/* TRUST PROXY (IMPORTANT FOR AWS / NGINX) */
/* ------------------------------------------------------------------ */
app.set("trust proxy", 1);

/* ------------------------------------------------------------------ */
/* MONGOOSE PERFORMANCE FIXES */
/* ------------------------------------------------------------------ */
mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 5000);

/* ------------------------------------------------------------------ */
/* CORS (FIXES PREFLIGHT SLOWNESS) */
/* ------------------------------------------------------------------ */
app.use(
    cors({
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* ------------------------------------------------------------------ */
/* HELMET (OPTIMIZED) */
/* ------------------------------------------------------------------ */
app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
);

/* ------------------------------------------------------------------ */
/* BODY PARSERS */
/* ------------------------------------------------------------------ */
app.use(
    express.json({
      limit: "2mb",
      verify: (req, res, buf) => {
        req.rawBody = buf.toString();
      },
    })
);
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

/* ------------------------------------------------------------------ */
/* LOGGING (ONLY IN DEV) */
/* ------------------------------------------------------------------ */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ------------------------------------------------------------------ */
/* RATE LIMITER (ONLY AUTH / PUBLIC ROUTES) */
/* ------------------------------------------------------------------ */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);

/* ------------------------------------------------------------------ */
/* DATABASE CONNECTION */
/* ------------------------------------------------------------------ */
(async () => {
  try {
    await dbConnect();
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
})();

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongo Error:", err.message);
});

/* ------------------------------------------------------------------ */
/* DB READY CHECK (FAST & SAFE) */
/* ------------------------------------------------------------------ */
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database not ready",
    });
  }
  next();
});

/* ------------------------------------------------------------------ */
/* HEALTH ROUTES */
/* ------------------------------------------------------------------ */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Server is running",
    time: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    memory: process.memoryUsage().rss,
  });
});

app.get("/u/:id", renderSharedProfilePage);

/* ------------------------------------------------------------------ */
/* CRON JOBS */
/* ------------------------------------------------------------------ */
cron.schedule("1 0 * * *", checkPremiumExpiry);
cron.schedule("0 * * * *", runAdsExpiryCron);

/* ------------------------------------------------------------------ */
/* ROUTES */
/* ------------------------------------------------------------------ */
app.use("/api", userRouter);
app.use("/api", retailerRoute);
app.use("/api", storeRouter);
app.use("/api", adminRouter);
app.use("/api", superadminRouter);
app.use("/api", productRouter);
app.use("/api/order", orderRouter);
app.use("/api", onlineStoreRouter);
app.use("/api", reelRouter);
app.use("/api", cropRouter);
app.use("/api", chatRouter);
app.use("/api", deliveryRouter);
app.use("/api", adminAgriAdviceRouter);
app.use("/api", agriAdviceUserRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/shiprocket", shiprocketRouter);
app.use("/api/pickup-addresses", pickupAddressRouter);
app.use("/api", sellerRouter);
app.use("/api/donation", donationRoutes);
app.use("/api/coupon", couponRoutes);

app.post("/api/delivery/tracking/webhook", webhookTracking);

/* ------------------------------------------------------------------ */
/* ERROR HANDLER */
/* ------------------------------------------------------------------ */
app.use((err, req, res, next) => {
  console.error("🔴 Error:", err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* ------------------------------------------------------------------ */
/* SERVER */
/* ------------------------------------------------------------------ */
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});

/* ------------------------------------------------------------------ */
/* SOCKET.IO */
/* ------------------------------------------------------------------ */
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  pingTimeout: 120000,
  pingInterval: 30000,
  transports: ["polling", "websocket"],
});

io.use(isSocketAuthenticated);

io.on("connection", (socket) => {
  socket.emit("connection_success", {
    socketId: socket.id,
    time: Date.now(),
  });

  if (enableChatSockets) {
    socket.on("createChat", (b, cb) => createChat(io, socket, b, cb));
    socket.on("sendMessage", (b, cb) => sendMessage(io, socket, b, cb));
    socket.on("getMessage", (b, cb) => getMessages(io, socket, b, cb));
  }

  socket.on("goOnline", (b, cb) => goOnlineSocket(io, socket, b, cb));
  socket.on("goOffline", (b, cb) => goOfflineSocket(io, socket, b, cb));
});

/* ------------------------------------------------------------------ */
/* PROCESS SAFETY */
/* ------------------------------------------------------------------ */
process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);
