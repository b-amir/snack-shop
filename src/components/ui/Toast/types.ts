export type ToastType = "success" | "error";

export type ToastProps = {
  message: string | null;
  type: ToastType;
  duration?: number;
  onClose: () => void;
};
