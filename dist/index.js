"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const allowedOrigins = (_a = process.env.front_end_domain) !== null && _a !== void 0 ? _a : '*';
const options = {
    origin: allowedOrigins
};
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.port || 3001;
const mongoConnectionString = (_b = process.env.mongodburi) === null || _b === void 0 ? void 0 : _b.toString();
const apiVersion = process.env.api_version || "V1";
// Middleware
app.use((0, cors_1.default)(options));
// Connect to MongoDB Atlas
(0, mongoose_1.connect)(`${mongoConnectionString}`, {})
    .then(() => console.log('Connected to MongoDB Database'))
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err.message));
app.use(express_1.default.json());
// Routes
app.use(`/api/${apiVersion}/todo`, todoRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running API ${apiVersion} on port ${port}`);
});
