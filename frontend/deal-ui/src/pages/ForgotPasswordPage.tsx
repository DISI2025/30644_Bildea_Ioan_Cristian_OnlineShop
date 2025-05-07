import {Layout, theme, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from '../context/SnackbarContext';
import {ROUTES} from '../routes/AppRouter';
import {ForgotPasswordForm} from '../components/auth/ForgotPasswordForm';
import {SimpleHeader} from '../components/common/SimpleHeader';
import {useForgotPasswordMutation} from "../store/api.ts";
import {BaseResponse, DealResponse, ForgotPasswordRequest, ForgotPasswordResponse} from "../types/transfer.ts";

const {Content} = Layout;
const {Title, Text} = Typography;
const {useToken} = theme;

export default function ForgotPasswordPage() {
    const [forgotPassword] = useForgotPasswordMutation();
    const {showSuccess, showError, showErrors} = useSnackbar();
    const navigate = useNavigate();
    const {token} = useToken();

    const handleForgotPasswordSuccess = (data: ForgotPasswordRequest) => {
        forgotPassword(data).unwrap()
            .then((response: DealResponse<ForgotPasswordResponse>) => {
                showSuccess('Reset Link Sent', response.payload.message);
                navigate(ROUTES.LOGIN);
            })
            .catch((response: BaseResponse) => {
                showErrors(response?.errors);
            });
    };

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
                            Forgot your password?
                        </Title>
                        <Text style={{
                            textAlign: "center",
                            fontSize: token.customFontSize.sm,
                            color: token.colorTextSecondary,
                        }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </Text>
                    </div>

                    <ForgotPasswordForm
                        onForgotPasswordSuccess={handleForgotPasswordSuccess}
                        onForgotPasswordError={(message) => {
                            showError("Oops!", message);
                        }}
                    />
                </div>
            </Content>
        </Layout>
    );
}

