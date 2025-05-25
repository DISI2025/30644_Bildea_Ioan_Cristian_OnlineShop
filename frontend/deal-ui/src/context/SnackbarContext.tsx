import React, {createContext, useContext} from 'react';
import {notification, theme} from 'antd';
import {DealError} from "../types/transfer.ts";

interface SnackbarContextProps {
   showError: (msg: string, description?: string | DealError | null) => void;
   showErrors: (descriptions?: string[] | null) => void;
   showDealErrors: (errors: DealError[] | null) => void;
   showSuccess: (msg: string, description?: string) => void;
   showInfo: (msg: string, description?: string, duration?:  number | null | undefined) => void;
   showClickableInfo: (msg: string, description?: string, onClick?: () => void, duration?: number | null | undefined) => void;
   showOrderNotification: (orderId: string, status: string, onClick?: () => void) => void;
   showWarning: (msg: string, description?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider: React.FC<React.PropsWithChildren<object>> = ({children}) => {
   const [api, contextHolder] = notification.useNotification();
   const { token } = theme.useToken();

   const openNotificationWithIcon = (
      type: 'success' | 'info' | 'warning' | 'error',
      message: string,
      description?: string,
      duration :  number | null | undefined = 3
   ) => {
      api.open({
         type,
         message,
         description,
         placement: 'topRight',
         duration: duration,
      });
   };

   const showError = (msg: string, description?: string | DealError | null) => {
      const content = typeof description === 'string' ? description : description?.message;
      openNotificationWithIcon('error', msg, content);
   };

   const showErrors = (descriptions?: string[] | null) => {
      const description = descriptions?.join(', ');
      openNotificationWithIcon('error', "There are multiple errors!", description);
   };

   const showDealErrors = (errors: DealError[] | null) => {
      if (!errors) return "";

      const description = errors.map((error: DealError) => error.message).join(", ");
      openNotificationWithIcon('error', errors.length > 1 ? "There are multiple errors!" : "Something went wrong", description);
   }

   const showSuccess = (msg: string, description?: string,) => {
      openNotificationWithIcon('success', msg, description);
   };

   const showInfo = (msg: string, description?: string, duration :  number | null | undefined = 3) => {
      openNotificationWithIcon('info', msg, description, duration);
   };

   const showClickableInfo = (msg: string, description?: string, onClick?: () => void, duration :  number | null | undefined = 5) => {
      api.open({
         type: 'info',
         message: msg,
         description,
         placement: 'topRight',
         duration: duration,
         style: onClick ? { cursor: 'pointer' } : undefined,
         onClick: onClick,
      });
   };

   const showOrderNotification = (orderId: string, status: string, onClick?: () => void) => {
      const getStatusColor = (status: string) => {
         switch (status.toLowerCase()) {
            case 'pending': return token.colorWarning;
            case 'processing': return token.colorPrimary;
            case 'shipping': return token.colorInfo;
            case 'done': 
            case 'completed': return token.colorSuccess;
            case 'cancelled': return token.colorError;
            default: return token.colorPrimary;
         }
      };

      const getStatusEmoji = (status: string) => {
         switch (status.toLowerCase()) {
            case 'pending': return '⏳';
            case 'processing': return '⚙️';
            case 'shipping': return '🚚';
            case 'done':
            case 'completed': return '✅';
            case 'cancelled': return '❌';
            default: return '📦';
         }
      };

      const statusColor = getStatusColor(status);

      api.open({
         message: (
            <div style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: token.paddingMD,
               padding: `${token.paddingXS}px 0`
            }}>
               <div style={{
                  fontSize: '24px',
                  animation: 'pulse 2s ease-in-out infinite',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
               }}>
                  {getStatusEmoji(status)}
               </div>
               <div style={{ flex: 1 }}>
                  <div style={{ 
                     fontWeight: token.fontWeightStrong, 
                     fontSize: token.fontSizeLG,
                     color: token.colorText,
                     marginBottom: token.marginXXS,
                     lineHeight: 1.2
                  }}>
                     Order Update
                  </div>
                  <div style={{ 
                     fontSize: token.fontSizeSM, 
                     color: token.colorTextSecondary,
                     lineHeight: 1.3
                  }}>
                     Click to view details
                  </div>
               </div>
            </div>
         ),
         description: (
            <div style={{ 
               marginTop: token.marginSM,
               padding: token.paddingMD,
               borderRadius: token.borderRadiusLG,
               background: token.colorBgContainer,
               border: `2px solid ${statusColor}`,
               boxShadow: `0 ${token.boxShadowSecondary}`,
               transition: 'all 0.3s ease'
            }}>
               <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: token.marginSM
               }}>
                  <span style={{ 
                     fontSize: token.fontSizeSM, 
                     color: token.colorTextSecondary,
                     fontWeight: token.fontWeightStrong
                  }}>
                     Order ID
                  </span>
                  <span style={{ 
                     fontSize: token.fontSizeSM, 
                     fontFamily: token.fontFamilyCode || 'monospace',
                     padding: `${token.paddingXXS}px ${token.paddingXS}px`,
                     backgroundColor: token.colorFillSecondary,
                     borderRadius: token.borderRadiusSM,
                     color: token.colorText,
                     border: `1px solid ${token.colorBorder}`
                  }}>
                     {orderId}
                  </span>
               </div>
               <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: token.marginSM
               }}>
                  <div style={{
                     width: '10px',
                     height: '10px',
                     borderRadius: '50%',
                     backgroundColor: statusColor,
                     animation: 'pulse 2s ease-in-out infinite',
                     boxShadow: `0 0 0 2px ${statusColor}20`
                  }} />
                  <span style={{ 
                     fontSize: token.fontSize,
                     fontWeight: token.fontWeightStrong,
                     color: statusColor,
                     textTransform: 'capitalize',
                     letterSpacing: '0.02em'
                  }}>
                     {status}
                  </span>
               </div>
            </div>
         ),
         placement: 'topRight',
         duration: 3,
         style: {
            cursor: onClick ? 'pointer' : 'default',
            border: `1px solid ${statusColor}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowTertiary,
            animation: 'slideInRight 0.3s ease-out',
            background: token.colorBgElevated,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            minWidth: '320px',
            maxWidth: '400px'
         },
         onClick: onClick,
         icon: null
      });
   };

   const showWarning = (msg: string, description?: string) => {
      openNotificationWithIcon('warning', msg, description);
   };

   return (
      <SnackbarContext.Provider value={{showError, showErrors, showSuccess, showInfo, showClickableInfo, showOrderNotification, showWarning, showDealErrors}}>
         {contextHolder}
         {children}
      </SnackbarContext.Provider>
   );
};

export const useSnackbar = (): SnackbarContextProps => {
   const context = useContext(SnackbarContext);
   if (!context) {
      throw new Error('useSnackbar must be used within a SnackbarProvider');
   }
   return context;
};
