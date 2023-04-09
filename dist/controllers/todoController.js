"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPendingTodo = exports.getAllCompletedTodo = void 0;
const todoSchema_1 = require("../schemas/todoSchema");
const Todo_1 = require("../config/Todo");
const getAllCompletedTodo = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield todoSchema_1.TodoModel.find({ isComplete: true });
});
exports.getAllCompletedTodo = getAllCompletedTodo;
const getAllPendingTodo = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield todoSchema_1.TodoModel.find({ isComplete: false });
});
exports.getAllPendingTodo = getAllPendingTodo;
const getFilteredTodo = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let q = query !== null && query !== void 0 ? query : "";
    if (query !== "" && query.length >= 3) {
        const completedTodos = yield todoSchema_1.TodoModel.aggregate([
            {
                $search: {
                    index: "todoSearch",
                    text: {
                        query: q,
                        path: {
                            wildcard: "*"
                        }
                    }
                },
            },
            {
                $limit: Todo_1.PER_PAGE
            },
            {
                "$match": {
                    "isComplete": {
                        "$eq": true,
                    }
                }
            },
        ]);
        const openTodos = yield todoSchema_1.TodoModel.aggregate([
            {
                $search: {
                    index: "todoSearch",
                    text: {
                        query: q,
                        path: {
                            wildcard: "*"
                        }
                    }
                },
            },
            {
                "$match": {
                    "isComplete": {
                        "$eq": false,
                    }
                }
            },
        ]);
        return {
            completedTodos: completedTodos,
            openTodos: openTodos
        };
    }
    if (q == "") {
        return {
            completedTodos: (0, exports.getAllCompletedTodo)(),
            openTodos: (0, exports.getAllPendingTodo)(),
        };
    }
    return {
        completedTodos: [],
        openTodos: [],
    };
});
exports.default = getFilteredTodo;
