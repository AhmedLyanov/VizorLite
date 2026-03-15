import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import DefaultLayout from "../layout/default/Default";
import SecureLayout from "../layout/auth/Auth";
import MinimalLayout from "../layout/minimal/Minimal";
import { ProtectedRoute } from "../../shared/ui/protected";

const HomePage = lazy(() => import("../../pages/home/HomePage"));
const ProfilePage = lazy(() => import("../../pages/profile/ProfilePage"));
const RoomPage = lazy(() => import("../../pages/room/RoomPage"));
const CommunityPage = lazy(() => import("../../pages/community/CommunityPage"));
const AuthPage = lazy(() => import("../../pages/auth/AuthPage"));
const AboutPage = lazy(() => import("../../pages/about/AboutPage"));
const PricingPage = lazy(() => import("../../pages/pricing/PricingPage"));
const NotFound = lazy(() => import("../../pages/notfound/Notfound"));

export const routes: RouteObject[] = [
  {
    element: <MinimalLayout />,
    children: [
      { path: "/pricing", element: <PricingPage /> },
      { path: "/about", element: <AboutPage /> },
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
