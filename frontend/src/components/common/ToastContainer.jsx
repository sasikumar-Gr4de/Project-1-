import React from "react";
import { useToastStore } from "@/store/toastStore";
import Toast from "@/components/common/KernelToast";

const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-2 z-[100] max-w-md ">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
