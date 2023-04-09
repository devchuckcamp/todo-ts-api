import { Router } from 'express'
import { TodoModel } from '../schemas/todoSchema'
import { PER_PAGE } from '../config/Todo'
import FilteredTodosResponseDto from '../interfaces/filteredTodosResponseDto'
const router = Router()

// Create a product
router.post('/', async (req, res) => {
    try {
        const todo = new TodoModel(req.body)
        await todo.save()
        res.status(201).json(todo)
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

// Get all todos
router.get('/', async (_, res) => {
    try {
        const todos = await TodoModel.find()
        res.status(200).json(todos)
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

router.get('/pending', async (_, res) => {
    try {
        const todos = await TodoModel.find({ isComplete: false }).sort({length:1,name:1})


        res.status(200).json(todos)
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

router.get('/completed', async (_, res) => {
    try {
        const todos = await TodoModel.find({ isComplete: true }).sort({length:1,name:1}).limit(PER_PAGE)
        res.status(200).json(todos)
    } catch (err) {
        res.status(500).json({ message: err })
    }
})
router.get('/filter', async (req, res) => {
    try {
        const openTodos = await TodoModel.find({ isComplete: false }).sort({length:1,name:1})
        const completedTodos = await TodoModel.find({ isComplete: true }).sort({length:1,name:1}).limit(PER_PAGE)
        var result:FilteredTodosResponseDto = {
            completedTodos:completedTodos,
            openTodos:openTodos,
        }
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ message: err })
    }
   
})

router.get('/filter/:query', async (req, res) => {
    let query = req.params.query??""
    if(query !== "" && query.length>=3){
        try {   
                const completedTodos = await TodoModel.aggregate([
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
                        $limit: PER_PAGE,
                        
                    },
                    {
                        $sort:{length:1, name:1}
                    },
                    {
                        "$match": {
                            "isComplete": {
                                "$eq": true,
                            }
                        }
                    },
                ])
            
                const openTodos = await TodoModel.aggregate([
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
                        $sort:{length:1, name:1}
                    },
                    {
                        "$match": {
                            "isComplete": {
                                "$eq": false,
                            }
                        }
                    },
                ])
                var result:FilteredTodosResponseDto = {
                    completedTodos:completedTodos,
                    openTodos:openTodos,
                }
                
                res.status(200).json(result)
            
        } catch (err) {
            res.status(500).json({ message: err })
        }
    } else {
        var result:FilteredTodosResponseDto = {
            completedTodos: await TodoModel.find({ isComplete: true }).limit(PER_PAGE),
            openTodos: await TodoModel.find({ isComplete: false }),
        }
        res.status(200).json(result)

    }
  })


// Get a Todo by ID
router.get('/:id', async (req, res) => {
    try {
        const todo = await TodoModel.findById(req.params.id)
        if (todo) res.status(200).json(todo)
        else res.status(404).json({ message: 'Item not found' })
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

// Update a Todo by ID
router.put('/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const todo = await TodoModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (todo) res.status(200).json(todo)
        else res.status(404).json({ message: 'Item not found' })
    } catch (err) {
        res.status(500).json({ message: err })
    }
})
// Comoplete/Uncomplete a Todo by ID
router.put('/complete/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const todo = await TodoModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

        var result:FilteredTodosResponseDto = {
            completedTodos: await TodoModel.find({ isComplete: true }).sort({length:1, name:1}).limit(PER_PAGE),
            openTodos: await TodoModel.find({ isComplete: false }).sort({length:1, name:1}),
        }
        if (todo) res.status(200).json(result)
        else res.status(404).json({ message: 'Item not found' })
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

// Delete a todo by ID
router.delete('/:id', async (req, res) => {
    try {
        const todo = await TodoModel.findByIdAndDelete(req.params.id)
        if (todo) res.status(200).json({ message: 'Todo deleted' })
        else res.status(404).json({ message: 'Todo not found' })
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

// Delete all todo items
router.delete('/', async (req, res) => {
    try {
        const todo = await TodoModel.deleteMany({})
        if (todo.acknowledged) res.status(200).json({ message: 'All Todo deleted' })
        else res.status(404).json({ message: 'Operation failed' })
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

export default router