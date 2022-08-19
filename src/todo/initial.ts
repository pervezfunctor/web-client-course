import { Todo, State } from './model'

export const todoList: readonly Todo[] = [
  {
    id: 1,
    title: 'delectus aut autem',
    completed: false,
  },
  {
    id: 2,
    title: 'quis ut nam facilis et officia qui',
    completed: false,
  },
  {
    id: 3,
    title: 'fugiat veniam minus',
    completed: false,
  },
  {
    id: 4,
    title: 'et porro tempora',
    completed: true,
  },
  {
    id: 5,
    title: 'laboriosam mollitia et enim quasi adipisci quia provident illum',
    completed: false,
  },
  {
    id: 6,
    title: 'qui ullam ratione quibusdam voluptatem quia omnis',
    completed: false,
  },
  {
    id: 7,
    title: 'illo expedita consequatur quia in',
    completed: false,
  },
  {
    id: 8,
    title: 'quo adipisci enim quam ut ab',
    completed: true,
  },
  {
    id: 9,
    title: 'molestiae perspiciatis ipsa',
    completed: false,
  },
  {
    id: 10,
    title: 'illo est ratione doloremque quia maiores aut',
    completed: true,
  },
]

const initialTodos = todoList.reduce(
  (acc, v) => acc.set(v.id, v),
  new Map<number, Todo>(),
)

export const initialState: State = {
  todos: initialTodos,
  filter: 'All',
}