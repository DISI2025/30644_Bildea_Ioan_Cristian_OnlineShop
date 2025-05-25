import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {ConfigProvider} from 'antd';
import App from './App';
import store from './store';
import 'antd/dist/reset.css';
import {SnackbarProvider} from './context/SnackbarContext';
import {ThemeProvider, useTheme} from './context/ThemeContext';
import WebSocketConnection from './components/common/WebSocketConnection';

const ThemedApp: React.FC = () => {
    const {theme} = useTheme();
    return (
        <ConfigProvider theme={theme}>
            <SnackbarProvider>
                <WebSocketConnection/>
                <App/>
            </SnackbarProvider>
        </ConfigProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <ThemeProvider>
                <ThemedApp/>
            </ThemeProvider>
        </Provider>
    </BrowserRouter>
);
