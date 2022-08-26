import { enableMapSet } from 'immer'
import React from 'react'
import { TodoApp } from './use-query'

enableMapSet()

export const App = () => <TodoApp />
