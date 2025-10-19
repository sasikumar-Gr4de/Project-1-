import { create } from "zustand";

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      position: "top-right",
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (newToast.duration !== 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  success: (message, options = {}) => {
    return get().addToast({
      type: "success",
      message,
      ...options,
    });
  },

  error: (message, options = {}) => {
    return get().addToast({
      type: "error",
      message,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return get().addToast({
      type: "warning",
      message,
      ...options,
    });
  },

  info: (message, options = {}) => {
    return get().addToast({
      type: "info",
      message,
      ...options,
    });
  },
}));
