import { enableMapSet } from 'immer'
import React from 'react'
import { TodoApp } from './jotai'

enableMapSet()

export const App = () => <TodoApp />
