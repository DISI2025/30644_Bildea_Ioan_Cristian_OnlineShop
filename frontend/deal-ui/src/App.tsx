import {MainLayout} from './components/common/Layout';
import AppRouter from './routes/AppRouter.tsx';
import {ConfigProvider} from "antd";
import {useTheme} from "./context/ThemeContext.tsx";

function App() {
    const { theme } = useTheme();
   // TODO: <AssignCategoryPage /> add to Router
    return (
        <ConfigProvider theme={theme}>
            <MainLayout>
                <AppRouter/>
            </MainLayout>
        </ConfigProvider>

    );
}

export default App;
