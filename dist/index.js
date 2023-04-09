"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const allowedOrigins = '*';
const options = {
    origin: allowedOrigins
};
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const port = process.env.port || 3001;
const mongoConnectionString = ((_a = process.env.mongodburi) === null || _a === void 0 ? void 0 : _a.toString()) || 'mongodb+srv://santiago:password123!@cluster0.4jwmh9o.mongodb.net/?retryWrites=true&w=majority';
const apiVersion = process.env.api_version || "V1";
// Middleware
exports.app.use((0, cors_1.default)(options));
// Connect to MongoDB Atlas
(0, mongoose_1.connect)(`${mongoConnectionString}`, {})
    .then(() => console.log('Connected to MongoDB Database'))
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err.message));
exports.app.use(express_1.default.json());
// Routes
exports.app.use(`/api/${apiVersion}/todo`, todoRoutes_1.default);
exports.app.listen(port, () => {
    console.log(`Server is running API ${apiVersion} on port ${port}`);
});
