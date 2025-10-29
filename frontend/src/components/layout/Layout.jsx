import React from "react";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLES } from "@/utils/constants";
import AdminLayout from "@/components/layout/AdminLayout";
import PlayerLayout from "@/components/layout/PlayerLayout";
import AuthLayout from "@/components/layout/AuthLayout";

const Layout = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  if (user?.role === USER_ROLES.ADMIN) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <PlayerLayout>{children}</PlayerLayout>;
};

export default Layout;
