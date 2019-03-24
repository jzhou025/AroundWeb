import React, { Component } from 'react';  
import logo from '../assets/images/logo.svg';
import { Icon } from 'antd';

export class TopBar extends Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />           
            <span className="App-title">Around</span>
            
            {
                this.props.isLoggedin ? 
                <a onClick={this.props.handleLogout} className="logout">
                    <Icon type="logout" /> Logout
                </a>
                : null          
            }
          </header>
        );
    }
}