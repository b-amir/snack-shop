import { CartIconButton } from "@/features/cart/CartIconButton";
import { getDirection } from "@/utils/direction";
import { Logo } from "./Logo";
import styles from "./styles.module.css";

export function Header({ locale }: { locale: string }) {
  const dir = getDirection(locale);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Logo />
        <CartIconButton dir={dir} locale={locale} />
      </div>
    </header>
  );
}
