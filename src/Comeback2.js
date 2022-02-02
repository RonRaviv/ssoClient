import React from "react";
import logo from "./logo.svg";
import axios from "axios"
import "./App.css";
import { useSearchParams } from "react-router-dom";


export default async function Comeback() {
  const [data, setData] = React.useState(null);
  const [ searchParams ] = useSearchParams();
  const code = searchParams.get('code');
  // const session_state = searchParams.get('session_state')
  console.log(code);
  axios.get('http://127.0.0.1:3000/token', {
    params: {
      code: code,
    }
  }).then((user) => {
      console.log('here');
      setData(user)
    })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <p>{ user }</p> */}
        <div>{!data ? "Loading..." : data}</div>
      </header>
    </div>
  );
}

