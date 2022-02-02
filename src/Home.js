import axios from "axios"
import React from "react";
import "./App.css";

export default class Home extends React.Component {
  componentDidMount() {
    // const nonce = generators.nonce();
    const nonce = generateRandom(32);
    console.log(nonce);
    const state = generateRandom(32);
    window.localStorage.setItem('nonce', nonce);
    window.localStorage.setItem('state', state);
    axios.get('http://127.0.0.1:3000', {
      params: {
        nonce: nonce,
        state: state,
      }
    })
    .then((res) => {
      window.location.href = res.data;
    })
    
  }
  
  render() {
    return (
      <div>Home</div>
    );
  } 
}

function generateRandom(length) {
  let random = ''
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    random += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return random;
}
