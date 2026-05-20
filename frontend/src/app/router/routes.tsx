import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth/protected";

import DefaultLayout from "../layout/default/Default";
import SecureLayout from "../layout/auth/Auth";
import MinimalLayout from "../layout/minimal/Minimal";


const HomePage = lazy(() => import("@/pages/home/HomePage"));
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const RoomPage = lazy(() => import("@/pages/room/RoomPage"));
const CommunityPage = lazy(() => import("@/pages/community/CommunityPage"));
const HistoryPricing = lazy(() => import("@/pages/history-pricing/history-pricing"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const AboutPage = lazy(() => import("@/pages/about/AboutPage"));
const PricingPage = lazy(() => import("@/pages/pricing/PricingPage"));
const ProFeaturesPage = lazy(() => import('@/pages/pro-features/ProFeaturesPage'));
const NotFound = lazy(() => import("@/pages/notfound/Notfound"));
const FAQPage = lazy(() => import("@/pages/faq/FAQPage"));

export const routes: RouteObject[] = [
  {
    element: <MinimalLayout />,
    children: [
      { path: "/pricing", element: <PricingPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/payments", element: <HistoryPricing /> },
      { path: "/pro", element: <ProFeaturesPage /> },
    ],
  },

  {
    element: <DefaultLayout />,
    children: [
      { path: "/community", element: <CommunityPage /> },

      { path: "/", element: <HomePage /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    element: <SecureLayout />,
    children: [
      { path: "/auth", element: <AuthPage /> },
      { path: "/room/:roomId", element: <RoomPage /> },
    ],
  },

  { path: "*", element: <NotFound /> },
];
