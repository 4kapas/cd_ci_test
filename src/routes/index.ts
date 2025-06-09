export * from "./const";
// export * from './PrivateRoute';

import * as paths from "./const";
import * as pages from "../pages";

interface routesConfig {
  //@ts-ignore
  common: Array<{
    path: string;
    component: any;
  }>;
}

export const routes: routesConfig = {
  common: [
    { path: paths.ROUTE_DATASET, component: pages.DatasetPageComponent },
    { path: paths.ROUTE_DETECTION, component: pages.DetectionPageComponent },
    {
      path: paths.ROUTE_SERVICE_POTREE,
      component: pages.ServicePotreeComponent,
    },
    { path: paths.ROUTE_LOGIN, component: pages.LoginPageComponent },
  ],
};
