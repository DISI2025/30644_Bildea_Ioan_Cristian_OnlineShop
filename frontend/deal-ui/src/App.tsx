import { MainLayout } from './components/common/MainLayout';
import AppRouter from './routes/AppRouter.tsx';

function App() {
    return (
        <MainLayout>
            <AppRouter/>
        </MainLayout>
    );
}

export default App;
