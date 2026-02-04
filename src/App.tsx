import React from 'react'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo List App</h1>
        <p>Manage your tasks efficiently</p>
      </header>
      <main className="app-main">
        <div className="todo-container">
          <p>Ready to build your todo list!</p>
        </div>
      </main>
    </div>
  )
}

export default App
