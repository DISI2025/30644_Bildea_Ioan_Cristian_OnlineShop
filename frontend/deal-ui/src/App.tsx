import {MainLayout} from './components/common/Layout';
import AppRouter from './routes/AppRouter.tsx';
import {ConfigProvider} from "antd";
import {useTheme} from "./context/ThemeContext.tsx";
import {StripeProvider} from './context/StripeContext';

function App() {
    const {theme} = useTheme();

    return (
        <ConfigProvider theme={theme}>
            <StripeProvider>
                <MainLayout>
                    <AppRouter/>
                </MainLayout>
            </StripeProvider>
        </ConfigProvider>

    );
}

export default App;
