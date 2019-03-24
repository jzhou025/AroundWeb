import React, { Component } from 'react';
import { TopBar } from './TopBar';
import { Main } from './Main';
import { TOKEN_KEY } from '../constants';


class App extends Component {
    state = {
        isLoggedin: !!localStorage.getItem(TOKEN_KEY) // true if localStorage has TOKEN_KEY
    }

    handleLogin = (token) => {
        this.setState({ isLoggedin: true }); 
        localStorage.setItem(TOKEN_KEY, token); // store string key-value pair
    }

    handleLogout = () => {
        this.setState({ isLoggedin: false });
        localStorage.removeItem(TOKEN_KEY);
    }

    render() {
        return (
            <div className="App">
                <TopBar 
                    isLoggedin={this.state.isLoggedin}
                    handleLogout={this.handleLogout}    
                />
                <Main 
                    isLoggedin={this.state.isLoggedin}
                    handleLogin={this.handleLogin}
                />
            </div>
        );
    }
}

export default App;
