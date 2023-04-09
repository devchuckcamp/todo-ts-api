import { Router } from 'express'
import ITodo from '../interfaces/ITodo'
import { TodoModel } from '../schemas/todoSchema'
import { PER_PAGE } from '../config/Todo'

export const getAllCompletedTodo = async () =>{
    return  await TodoModel.find({ isComplete: true })
}

export const getAllPendingTodo = async () =>{
    return  await TodoModel.find({ isComplete: false })
}

const getFilteredTodo = async (query:string) =>{
    let q = query??""
   
    if(query !== "" && query.length>=3){
        const completedTodos = await TodoModel.aggregate([
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
                $limit: PER_PAGE
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
        ])
        return {
            completedTodos:completedTodos,
            openTodos:openTodos
        }
    }
    if(q == ""){
        return {
            completedTodos:getAllCompletedTodo(),
            openTodos:getAllPendingTodo(),
        }
    }
    return {
        completedTodos:[],
        openTodos:[],
    }
    
}

export default getFilteredTodo