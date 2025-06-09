// // base
import React from "react";
// import { RedirectToLogin } from 'component';
// import LoginPage from 'pages/auth/login';
// import React from 'react';
// import { Route } from 'react-router';
// import { useNavigate } from "react-router-dom";
// import { ROUTE_LOGIN } from './const';

// interface PrivateRouteProps {
//   component: React.LazyExoticComponent<() => React.JSX.Element>;
//   fallback: () => React.JSX.Element;
//   isPermission: boolean;
//   isLogin: boolean;
//   key: any;
//   path: string;

//   // exact?:any;
// }

// export const PrivateRoute = (props: PrivateRouteProps) => {
//   const { component: Component, fallback: Fallback, isPermission, isLogin, path } = props;
//   if (!isLogin && (path !== ROUTE_LOGIN)) {
//     return <RedirectToLogin isLogin={isLogin} />
//   }
//   return isPermission ? <Component /> : <Fallback />
//   // let returnEle = {isPermission ? (<component />) : <fallback />};
//   // return {isPermission ? (<component />) : fallback};
//   // <Route {...rest} component={isPermission(user) ? component : fallback} />
//   // return <Route {...rest} Component={isPermission ? component : fallback} />;
// };

// // export const PrivateRouteFallBack = ({ isPermission, component: Component }) => {
// //   const navigate = useNavigate();

// //   return <Component />;
// // };