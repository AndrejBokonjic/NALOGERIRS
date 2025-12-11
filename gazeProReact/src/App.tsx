//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { Pozdrav } from "./components/InUseComponents/Pozdrav.tsx";

import { FileProcessing } from "./components/InUseComponents/FileProcessing.tsx";

import React, { useEffect, useState } from "react";
import * as path from "path";


function App() {
  //const [count, setCount] = useState(0)
  const [showText, setShowText] = useState(false);
  const [textSize, setTextSize] = useState(16);


  return (
    <>

      <Pozdrav />

      <FileProcessing />

      {/* 1) Spremeni barvo ozadja */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            document.body.style.backgroundColor =
              document.body.style.backgroundColor === "lightblue"
                ? "white"
                : "lightblue";
          }}
        >
          Spremeni barvo ozadja
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowText(!showText)}>
          {showText ? "Skrij obvestilo" : "Prikaži obvestilo"}
        </button>
        {showText && (
          <p style={{ marginTop: "10px" }}>
            To je testno dodatno besedilo za demonstracijo funkcionalnosti.
          </p>
        )}

      </div>

            <div style={{ marginTop: "20px" }}>
        <p style={{ fontSize: textSize }}>
          To besedilo lahko spreminja velikost.
        </p>
        <button onClick={() => setTextSize(textSize + 2)}>+</button>
        <button onClick={() => setTextSize(textSize - 2)} style={{ marginLeft: "10px" }}>
          -
        </button>
      </div>

      {/*<TableTemplate />*/}

      {/*<FileUpload/>*}/


        {/*
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      */}
    </>
  )
}

export default App
