import { timeStamp } from 'console'
import { Schema, model } from 'mongoose'
import { boolean } from 'webidl-conversions'
import ITodo from '../interfaces/ITodo'

const todoSchema = new Schema<ITodo>({
  name: { type: String, required: true, index:true },
  isComplete: { type: Boolean, default: false}
  
}, {timestamps:true})

export const TodoModel = model<ITodo>('Todo', todoSchema)