import React from "react";
import { useToastStore } from "../../store/toastStore";
import Toast from "./toast";

const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-3 right-4 z-50 space-y-3 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
