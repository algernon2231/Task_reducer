import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Task from './Task'

function App() {
  return (
    <div className="App">
      <Task />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
