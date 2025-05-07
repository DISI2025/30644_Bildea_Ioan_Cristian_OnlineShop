import {Button, Divider, Layout, theme, Typography} from "antd";
import {AppleOutlined, GoogleOutlined} from "@ant-design/icons";
import {useSnackbar} from "../context/SnackbarContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {AuthData, AuthRequest, BaseResponse, DealResponse} from "../types/transfer.ts";
import {useLoginMutation} from "../store/api.ts";
import {useDispatch, useSelector} from "react-redux";
import {AuthState, selectAuthState, startSession} from "../store/slices/auth-slice.ts";
import {LoginForm} from "../components/auth/LoginForm";
import {SimpleHeader} from "../components/common/SimpleHeader";
import {getRedirectedPath} from "../utils/url.ts";
import {useEffect} from "react";

const {Content} = Layout;
const {Title, Text} = Typography;
const {useToken} = theme;

export default function LoginPage() {
   const {showSuccess, showInfo, showErrors, showDealErrors} = useSnackbar();
   const dispatch = useDispatch();
   const authState: AuthState = useSelector(selectAuthState);
   const navigate = useNavigate();
   const location = useLocation();
   const [login] = useLoginMutation();
   const {token} = useToken();

   const handleLoginSuccess = (data: AuthRequest) => {
      login(data).unwrap().then((response: DealResponse<AuthData>) => {
         dispatch(startSession(response.payload));
         showSuccess('Login Successful', 'You have been logged in successfully.');
         navigate(getRedirectedPath(location.search));
      }).catch((response: BaseResponse) => {
         showDealErrors(response?.errors);
      });
   };

   useEffect(() => {
      if (authState.loggedIn) {
         navigate(getRedirectedPath(location.search));
      }

      return () => {
      };
   }, [authState.loggedIn, location.search, navigate]);

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
                     Welcome back
                  </Title>
                  <Text style={{
                     textAlign: "center",
                     fontSize: token.customFontSize.sm,
                     color: token.colorTextSecondary,
                  }}>
                     Sign in to your DEAL account
                  </Text>
               </div>

               <LoginForm
                  onLoginSuccess={handleLoginSuccess}
                  onLoginError={(message) => showErrors([message])}
               />

               <Divider style={{
                  color: token.colorTextSecondary,
                  fontSize: token.customFontSize.xs
               }}>Or continue with</Divider>

               <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: token.spacing.sm
               }}>
                  <Button
                     icon={<GoogleOutlined/>}
                     onClick={() => showInfo('FYI', 'Google authentication coming soon.')}
                     block
                     size="large"
                     style={{
                        borderRadius: token.borderRadius.sm,
                        height: token.controlHeight
                     }}
                  >
                     Google
                  </Button>
                  <Button
                     icon={<AppleOutlined/>}
                     onClick={() => showInfo('FYI', 'Apple authentication coming soon.')}
                     block
                     size="large"
                     style={{
                        borderRadius: token.borderRadius.sm,
                        height: token.controlHeight
                     }}
                  >
                     Apple
                  </Button>
               </div>
            </div>
         </Content>
      </Layout>
   );
}