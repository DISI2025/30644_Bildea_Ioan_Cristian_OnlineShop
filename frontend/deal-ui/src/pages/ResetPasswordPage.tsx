import {Layout, theme, Typography} from 'antd';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useSnackbar} from '../context/SnackbarContext';
import {ROUTES} from '../routes/AppRouter';
import {ResetPasswordForm} from '../components/auth/ResetPasswordForm';
import {SimpleHeader} from '../components/common/SimpleHeader';
import {useResetPasswordMutation} from "../store/api.ts";
import {BaseResponse, DealResponse, ResetPasswordRequest} from "../types/transfer.ts";

const {Content} = Layout;
const {Title, Text} = Typography;
const {useToken} = theme;

export default function ResetPasswordPage() {
   const [searchParams] = useSearchParams();
   const resetToken = searchParams.get('token');
   const [resetPassword] = useResetPasswordMutation();
   const {showSuccess, showError, showDealErrors} = useSnackbar();
   const navigate = useNavigate();
   const {token: themeToken} = useToken();

   if (!resetToken) {
      navigate(ROUTES.LOGIN);
   }

   const handleResetPasswordSuccess = (data: ResetPasswordRequest) => {
      resetPassword({token: data.token, newPassword: data.newPassword}).unwrap()
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
                     Reset your password
                  </Title>
                  <Text style={{
                     textAlign: "center",
                     fontSize: themeToken.customFontSize.sm,
                     color: themeToken.colorTextSecondary,
                  }}>
                     Please enter your new password below.
                  </Text>
               </div>

               <ResetPasswordForm
                  token={resetToken ?? ""}
                  onResetPasswordSuccess={handleResetPasswordSuccess}
                  onResetPasswordError={(message) => {
                     showError("Oops!", message);
                  }}
               />
            </div>
         </Content>
      </Layout>
   );
} 