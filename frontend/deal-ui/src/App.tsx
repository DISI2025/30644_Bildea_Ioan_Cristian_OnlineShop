import { ConfigProvider } from 'antd';
import AppRouter from './routes/AppRouter.tsx';
import { useTheme } from './context/ThemeContext';
import { Layout } from 'antd';

const { Content } = Layout;

function App() {
    const { theme } = useTheme();

    return (
        <ConfigProvider theme={theme}>
            <Layout style={{ minHeight: '100vh' }}>
                <Content>
                    <AppRouter/>
                </Content>
            </Layout>
        </ConfigProvider>
    );
}

export default App;
