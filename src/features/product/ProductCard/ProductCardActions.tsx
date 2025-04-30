"use client";

import { useState } from "react";
import { useCartStore } from "@/store/store";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import QuantityControl from "@/features/quantity-control/QuantityControl";
import { ProductCardActionsProps } from "./types";

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const t = useTranslations("common");

  const state = useCartStore();

  const isLoading = state.isLoading;
  const addToCart = state.addToCart;
  const updateQuantity = state.updateQuantity;
  const removeFromCart = state.removeFromCart;
  const cartQuantity =
    state.items.find((item) => item.product.id === product.id)?.quantity || 0;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsProcessing(true);
    try {
      await addToCart(product);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveFromCart();
      return;
    }
    setIsProcessing(true);
    try {
      await updateQuantity(product.id, newQuantity);
    } catch (error) {
      console.error("Update quantity failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setIsProcessing(true);
    try {
      await removeFromCart(product.id);
    } catch (error) {
      console.error("Remove from cart failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrease = () => {
    handleUpdateQuantity(cartQuantity - 1);
  };

  const handleChange = (val: number) => {
    handleUpdateQuantity(val);
  };

  return (
    <>
      {cartQuantity > 0 ? (
        <QuantityControl
          value={cartQuantity}
          fullWidth
          min={0}
          onIncrease={() => handleUpdateQuantity(cartQuantity + 1)}
          onDecrease={handleDecrease}
          onChange={handleChange}
          variant="button"
          iconClassName="icon-green"
          disabled={isLoading || isProcessing}
        />
      ) : (
        <Button
          variant="primary"
          fullWidth
          onClick={handleAddToCart}
          disabled={isLoading || isProcessing}
        >
          {isProcessing ? t("adding") : t("addToCart")}
        </Button>
      )}
    </>
  );
}
