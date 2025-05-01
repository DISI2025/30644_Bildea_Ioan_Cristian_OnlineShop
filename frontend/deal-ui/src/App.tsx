import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Home } from './pages/Home';
import RegisterPage from './pages/RegisterPage';
import { ROUTES } from './routes/AppRouters';
import { useTheme } from './context/ThemeContext';
import { Layout } from 'antd';

const { Content } = Layout;

function App() {
    const { theme } = useTheme();

    return (
        <ConfigProvider theme={theme}>
            <Layout style={{ minHeight: '100vh' }}>
                <Content>
                    <Routes>
                        <Route path={ROUTES.HOME} element={<Home />} />
                        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                        {/* Add more routes as needed */}
                    </Routes>
                </Content>
            </Layout>
        </ConfigProvider>
    );
}

export default App;
