import React from "react";
import axios from "axios"
import decode from 'jwt-decode';
import "./App.css";

export default class Comeback extends React.Component {
  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    axios.get('http://127.0.0.1:3000/token', {
      params: {
        code: code,
        state: window.localStorage.getItem('state'),
        nonce: window.localStorage.getItem('nonce'),
      }
    }).then((res) => {
        this.setState({ 
          tokenSet: res.data,
          accessToken: res.data.access_token,
          accessTokenDecoded: decode(res.data.access_token),
          refreshToken: res.data.refresh_token,
          refreshTokenDecoded: decode(res.data.refresh_token),
          idToken: res.data.id_token,
          idTokenDecoded: decode(res.data.id_token),
         });
      })
  }

  render() {
    const testAuth = () => {
      axios.get('http://127.0.0.1:3000/testAuth', {
        params: {
          'accessToken': this.state.accessToken,
          'refreshToken': this.state.refreshToken
        }
      }).then(() => {
        // console.log('valid token');
        alert('valid token');
      })
      .catch((error) => {
        const errorCode = error.response.status;
        if(errorCode === 403) {
          window.location.href = 'http://127.0.0.1:3001/auth'
          // console.log('restarted authentication');
          alert('restarted authentication')
        } else if(errorCode === 401) {
            this.setState({ 
              tokenSet: error.response.data,
              accessToken: error.response.data.access_token,
              accessTokenDecoded: decode(error.response.data.access_token),
              refreshToken: error.response.data.refresh_token,
              refreshTokenDecoded: decode(error.response.data.refresh_token),
              idToken: error.response.data.id_token,
              idTokenDecoded: decode(error.response.data.id_token),
            });
          //  console.log('refreshed token');
            alert('refreshed token');
        }
      })
    }

    return(
      <div className="App">
        { this.state && <div>{JSON.stringify(this.state.accessTokenDecoded)}</div>} 
        <button onClick={testAuth}>test auth</button>
      </div>
    )
  }
}

