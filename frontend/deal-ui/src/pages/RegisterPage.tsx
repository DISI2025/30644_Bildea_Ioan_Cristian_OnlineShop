import { Typography, Layout, theme } from "antd";
import { useSnackbar } from "../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm.tsx";
import { borderRadius, fontSize, layout as layoutTokens, spacing } from "../theme/tokens";
import { ROUTES } from "../routes/AppRouters";
import { SimpleHeader } from "../components/common/SimpleHeader.tsx";

const { Title, Text } = Typography;
const { Content } = Layout;
const { useToken } = theme;

export default function RegisterPage() {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const { token } = useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SimpleHeader />
      
      <Content style={{ 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: `calc(100vh - 48px)`,
        backgroundColor: token.colorBgLayout,
        padding: spacing.md,
        boxSizing: "border-box",
      }}>
        <div style={{
          width: "100%",
          maxWidth: layoutTokens.maxWidth.sm,
          backgroundColor: token.colorBgContainer,
          borderRadius: borderRadius.md,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          padding: `${spacing.xl} ${spacing.lg}`,
          display: "flex",
          flexDirection: "column",
          gap: spacing.lg
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.xxs
          }}>
            <Title level={3} style={{ 
              textAlign: "center", 
              margin: spacing.none,
              fontSize: fontSize.xxl,
              color: token.colorText,
            }}>
              Create your account
            </Title>
            <Text style={{ 
              textAlign: "center", 
              fontSize: fontSize.sm,
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