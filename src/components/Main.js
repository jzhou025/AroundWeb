import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Register } from './Register';
import { Login } from './Login';
import { Home } from './Home';

export class Main extends Component {
    getLogin = (props) => {
        // console.log(props);       
        return this.props.isLoggedin ?
            <Redirect to="/home" /> : 
            <Login handleLogin={this.props.handleLogin} />; // pass handleLogin from Main to Login
    }

    getHome = () => {
        return this.props.isLoggedin ?
            <Home /> :
            <Redirect to="/login" />
    }

    render () {
        return (
            <div className="main">
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/login" render={this.getLogin} />
                    <Route path="/home" render={this.getHome} />
                    <Route render={this.getLogin} />
                </Switch>
                
            </div>
        );
    }
}