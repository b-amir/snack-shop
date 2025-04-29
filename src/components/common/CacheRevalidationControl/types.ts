import { ToastType } from "@/components/ui/Toast";

export type ToastState = {
  message: string | null;
  type: ToastType;
};
