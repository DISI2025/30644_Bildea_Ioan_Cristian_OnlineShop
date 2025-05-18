import React, {createContext, useContext} from 'react';
import {notification} from 'antd';
import {DealError} from "../types/transfer.ts";

interface SnackbarContextProps {
   showError: (msg: string, description?: string | DealError | null) => void;
   showErrors: (descriptions?: string[] | null) => void;
   showDealErrors: (errors: DealError[] | null) => void;
   showSuccess: (msg: string, description?: string) => void;
   showInfo: (msg: string, description?: string) => void;
   showWarning: (msg: string, description?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider: React.FC<React.PropsWithChildren<object>> = ({children}) => {
   const [api, contextHolder] = notification.useNotification();

   const openNotificationWithIcon = (
      type: 'success' | 'info' | 'warning' | 'error',
      message: string,
      description?: string
   ) => {
      api.open({
         type,
         message,
         description,
         placement: 'topRight',
         duration: 3,
      });
   };

   // Todo: update this
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

   const showSuccess = (msg: string, description?: string) => {
      openNotificationWithIcon('success', msg, description);
   };

   const showInfo = (msg: string, description?: string) => {
      openNotificationWithIcon('info', msg, description);
   };

   const showWarning = (msg: string, description?: string) => {
      openNotificationWithIcon('warning', msg, description);
   };

   return (
      <SnackbarContext.Provider value={{showError, showErrors, showSuccess, showInfo, showWarning, showDealErrors}}>
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
