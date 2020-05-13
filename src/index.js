import React, { Component } from 'react';
import App from "./App";
import { StateProvider } from './store/store';

class AppContainer extends Component {
    render() {
        return (
            <StateProvider>
                <App />
            </StateProvider>
        );
    }
}

export default AppContainer;