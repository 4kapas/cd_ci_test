import { lazy } from "react";

// servicePotree
export const ServicePotreeComponent = lazy(() => import("./service"));

// login
export const LoginPageComponent = lazy(() => import("./login"));

// dataset
export const DatasetPageComponent = lazy(() => import("./dataset"));

// detection
export const DetectionPageComponent = lazy(() => import("./detection"));
