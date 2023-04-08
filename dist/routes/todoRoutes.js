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
const express_1 = require("express");
const todoSchema_1 = require("../schemas/todoSchema");
const Todo_1 = require("../config/Todo");
//import getFilteredTodo from '../controllers/todoController'
const router = (0, express_1.Router)();
// Create a product
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = new todoSchema_1.TodoModel(req.body);
        yield todo.save();
        res.status(201).json(todo);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
// Get all todos
router.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield todoSchema_1.TodoModel.find();
        res.status(200).json(todos);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
router.get('/pending', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield todoSchema_1.TodoModel.find({ isComplete: false });
        res.status(200).json(todos);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
router.get('/completed', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield todoSchema_1.TodoModel.find({ isComplete: true }).limit(Todo_1.PER_PAGE);
        res.status(200).json(todos);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
router.get('/filter/:query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let query = (_a = req.params.query) !== null && _a !== void 0 ? _a : "";
    if (query !== "" && query.length >= 3) {
        try {
            const completedTodos = yield todoSchema_1.TodoModel.aggregate([
                {
                    $search: {
                        index: "todoSearchCaseInsensitive",
                        text: {
                            query: query,
                            path: {
                                wildcard: "*"
                            },
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
                        index: "todoSearchCaseInsensitive",
                        text: {
                            query: query,
                            path: {
                                wildcard: "*",
                            },
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
            var result = {
                completedTodos: completedTodos,
                openTodos: openTodos,
            };
            res.status(200).json(result);
        }
        catch (err) {
            res.status(500).json({ message: err });
        }
    }
    else {
        res.status(200).json([]);
    }
}));
// Get a Todo by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield todoSchema_1.TodoModel.findById(req.params.id);
        if (todo)
            res.status(200).json(todo);
        else
            res.status(404).json({ message: 'Item not found' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
// Update a Todo by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        const todo = yield todoSchema_1.TodoModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (todo)
            res.status(200).json(todo);
        else
            res.status(404).json({ message: 'Item not found' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
// Delete a todo by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield todoSchema_1.TodoModel.findByIdAndDelete(req.params.id);
        if (todo)
            res.status(200).json({ message: 'Todo deleted' });
        else
            res.status(404).json({ message: 'Todo not found' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
// Delete all todo items
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield todoSchema_1.TodoModel.deleteMany({});
        if (todo.acknowledged)
            res.status(200).json({ message: 'All Todo deleted' });
        else
            res.status(404).json({ message: 'Operation failed' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
exports.default = router;
