interface BackIconProps {
  className: string;
}

export const BackIcon = ({ className }: BackIconProps) => {
  return (
    <span className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide-arrow-left"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </span>
  );
};
