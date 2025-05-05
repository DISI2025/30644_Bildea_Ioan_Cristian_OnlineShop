import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound.tsx';
import { Layout } from 'antd';

function App() {
    return (
        <Layout className="App" style={{ width: '100%', minHeight: '100vh' }}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    );
}

export default App;
