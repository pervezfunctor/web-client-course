import { enableMapSet } from 'immer'
import React from 'react'
import { TodoApp } from './valtio'

enableMapSet()

export const App = () => <TodoApp />
