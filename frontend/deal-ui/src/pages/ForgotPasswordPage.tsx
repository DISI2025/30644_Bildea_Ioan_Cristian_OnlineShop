import {Layout, theme, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from '../context/SnackbarContext';
import {ROUTES} from '../routes/AppRouter';
import {ForgotPasswordForm} from '../components/auth/ForgotPasswordForm';
import {SimpleHeader} from '../components/common/SimpleHeader';
import {useForgotPasswordMutation} from "../store/api.ts";
import {BaseResponse, DealResponse, ForgotPasswordRequest} from "../types/transfer.ts";

const {Content} = Layout;
const {Title, Text} = Typography;
const {useToken} = theme;

export default function ForgotPasswordPage() {
   const [forgotPassword] = useForgotPasswordMutation();
   const {showSuccess, showError, showDealErrors} = useSnackbar();
   const navigate = useNavigate();
   const {token: themeToken} = useToken();

   const handleForgotPasswordSuccess = (data: ForgotPasswordRequest) => {
      forgotPassword(data).unwrap()
         .then((response: DealResponse<unknown>) => {
            showSuccess('Success', response.message);
            navigate(ROUTES.HOME);
         })
         .catch((response: BaseResponse) => {
            showDealErrors(response?.errors);
         });
   };

   return (
      <Layout>
         <SimpleHeader/>
         <Content style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: `calc(100vh - ${themeToken.layout.headerHeight})`,
            backgroundColor: themeToken.colorBgLayout,
            padding: themeToken.spacing.md,
            boxSizing: "border-box",
         }}>
            <div style={{
               width: "100%",
               maxWidth: themeToken.layout.maxWidth.sm,
               backgroundColor: themeToken.colorBgContainer,
               borderRadius: themeToken.borderRadius.md,
               boxShadow: themeToken.shadows.light.md,
               padding: `${themeToken.spacing.xl} ${themeToken.spacing.lg}`,
               display: "flex",
               flexDirection: "column",
               gap: themeToken.spacing.lg
            }}>
               <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: themeToken.spacing.xxs
               }}>
                  <Title level={3} style={{
                     textAlign: "center",
                     margin: themeToken.spacing.none,
                     fontSize: themeToken.customFontSize.xxl,
                     color: themeToken.colorText,
                  }}>
                     Forgot your password?
                  </Title>
                  <Text style={{
                     textAlign: "center",
                     fontSize: themeToken.customFontSize.sm,
                     color: themeToken.colorTextSecondary,
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

