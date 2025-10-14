import { useState } from 'react'
import './App.css'

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      <h1>statistics</h1>
      <p>good {good}
        <br />
        neutral {neutral}
        <br />
        bad {bad}
        <br />
        all {all}
        <br />
        average {average}
        <br />
        positive {positive} %
      </p>
    </div>
  )
}

export default App
