import {ROUTES} from "../routes/AppRouter.tsx";

export const getRedirectedPath = (URI: string) => {
   if (URI && URI.length > 5)
      return URI.replace("?from=", "");
   return ROUTES.HOME;
}