import { Layout } from 'antd';
import AppRouter from './routes/AppRouter.tsx';

const { Content } = Layout;

function App() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content>
                <AppRouter/>
            </Content>
        </Layout>
    );
}

export default App;
