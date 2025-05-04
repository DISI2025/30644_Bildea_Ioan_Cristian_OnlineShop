import {Layout, Typography, theme} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from '../context/SnackbarContext';
import {ROUTES} from '../routes/AppRouter';
import {RegisterForm} from '../components/auth/RegisterForm';
import {SimpleHeader} from '../components/common/SimpleHeader';

const {Content} = Layout;
const {Title, Text} = Typography;
const {useToken} = theme;

export default function RegisterPage() {
    const {showSuccess, showError} = useSnackbar();
    const navigate = useNavigate();
    const {token} = useToken();

    return (
        <Layout>
            <SimpleHeader/>
            <Content style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: `calc(100vh - ${token.layout.headerHeight})`,
                backgroundColor: token.colorBgLayout,
                padding: token.spacing.md,
                boxSizing: "border-box",
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: token.layout.maxWidth.sm,
                    backgroundColor: token.colorBgContainer,
                    borderRadius: token.borderRadius.md,
                    boxShadow: token.shadows.light.md,
                    padding: `${token.spacing.xl} ${token.spacing.lg}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: token.spacing.lg
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: token.spacing.xxs
                    }}>
                        <Title level={3} style={{
                            textAlign: "center",
                            margin: token.spacing.none,
                            fontSize: token.customFontSize.xxl,
                            color: token.colorText,
                        }}>
                            Create your account
                        </Title>
                        <Text style={{
                            textAlign: "center",
                            fontSize: token.customFontSize.sm,
                            color: token.colorTextSecondary,
                        }}>
                            Start shopping with DEAL today
                        </Text>
                    </div>

                    <RegisterForm
                        onRegisterSuccess={() => {
                            showSuccess('Registration Successful', 'Your account has been created successfully.');
                            navigate(ROUTES.LOGIN);
                        }}
                        onRegisterError={(message) => {
                            showError("Oops!", message);
                        }}
                    />
                </div>
            </Content>
        </Layout>
    );
} 