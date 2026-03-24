import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";
import env from "./environments";

// Sovereign Handler Imports
import mountPaymentsEndpoints from "./handlers/payments";
import mountUserEndpoints from "./handlers/users";
import mountNotificationEndpoints from "./handlers/notifications";
// import mountChronosEndpoints from "./handlers/chronos"; // Future: ASI Module

import "./types/session";

const dbName = env.mongo_db_name;
const mongoUri = `mongodb://${env.mongo_host}/${dbName}`;
const mongoClientOptions = {
  authSource: "admin",
  auth: {
    username: env.mongo_user,
    password: env.mongo_password,
  },
};

const app: express.Application = express();

// --- I. MIDDLEWARE & PROBITY LOGGING ---

app.use(logger("dev")); // Console logs for development

// Strategic access logging for TechReg audit trails
const logDir = path.join(__dirname, "..", "log");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

app.use(
  logger("common", {
    stream: fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" }),
  }),
);

app.use(express.json());

app.use(
  cors({
    origin: env.frontend_url,
    credentials: true,
  }),
);

app.use(cookieParser());

// Sovereign Session Management (Stored in ASV)
app.use(
  session({
    secret: env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      mongoOptions: mongoClientOptions,
      dbName: dbName,
      collectionName: "sovereign_sessions", // Renamed for SIL Ltd branding
    }),
  }) as unknown as express.RequestHandler,
);

// --- II. SOVEREIGN MODULE MOUNTING ---

// Pi Network Payments
const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use("/payments", paymentsRouter);

// ASI Identity Gateway
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use("/user", userRouter);

// System Notifications
const notificationRouter = express.Router();
mountNotificationEndpoints(notificationRouter);
app.use("/notifications", notificationRouter);

// Novalex Health & Status
app.get("/", async (_, res) => {
  res.status(200).send({ 
    system: "Sovereign Novalex",
    status: "Operational",
    node: "Lagos-NG-Main",
    organization: "SIL Ltd"
  });
});

// --- III. VAULT INITIALIZATION & BOOT ---

const start = async () => {
  try {
    const client = await MongoClient.connect(mongoUri, mongoClientOptions);
    const db = client.db(dbName);
    
    // Global Collections for the Sovereign Vault (ASV)
    app.locals.orderCollection = db.collection("orders");
    app.locals.userCollection = db.collection("users");
    app.locals.auditCollection = db.collection("chronos_audits"); // New: ASI Audit Trail
    
    console.log("🌌 Sovereign Vault (ASV) Connected on: ", mongoUri);

    app.listen(env.port, () => {
      console.log(`🚀 Sovereign Hub listening on port ${env.port}`);
      console.log(`📡 DPI Handshake active for: ${env.frontend_url}`);
    });
  } catch (err) {
    console.error("❌ Sovereign Vault Connection Failed: ", err);
    process.exit(1);
  }
};

start();
