import { useState } from 'react'
import DoublePendulum from './DoublePendulum'
import './App.css'
import './styles.css'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="gradient">
        <header>UNDER CONSTRUCTION</header>
        <DoublePendulum />
      </div>
  )
}

export default App
