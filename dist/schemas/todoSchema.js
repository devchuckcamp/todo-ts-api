"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = void 0;
const mongoose_1 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
    name: { type: String, required: true, index: true },
    isComplete: { type: Boolean, default: false }
}, { timestamps: true });
exports.TodoModel = (0, mongoose_1.model)('Todo', todoSchema);
