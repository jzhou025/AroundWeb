import React, { Component } from 'react';
import { TopBar } from './TopBar';
import { Main } from './Main';

class App extends Component {
    state = {
        isLoggedin: false
    }

    handleLogin = () => {
        this.setState({ isLoggedin: true });
    }

    hanleLogout = () => {
        this.setState({ isLoggedin: false });
    }

    render() {
        return (
            <div className="App">
                <TopBar 
                    isLoggedin={this.state.isLoggedin}
                    hanleLogout={this.hanleLogout}    
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
