import ITodo from './ITodo'

interface FilteredTodosResponseDto {
 completedTodos:ITodo[]
 openTodos:ITodo[]
}

export default FilteredTodosResponseDto