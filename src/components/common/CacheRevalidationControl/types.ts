import { ToastType } from "@/components/ui/Toast/types";

export type ToastState = {
  message: string | null;
  type: ToastType;
};
