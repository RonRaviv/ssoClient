import axios from "axios"
import React from "react";
import "./App.css";

export default class Home extends React.Component {
  componentDidMount() {
    axios.get('http://127.0.0.1:3000')
    .then((res) => {
      window.localStorage.setItem('nonce', res.headers.nonce);
      window.localStorage.setItem('state', res.headers.state);
      window.location.href = res.data;
    })
  }
  
  render() {
    return (
      <div>Home</div>
    );
  } 
}
