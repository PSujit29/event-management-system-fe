
export const Button = ({ txt = "Button", type = "button", variant = "primary", onClick, className = "" }) => {
  const baseStyles =
    "w-full flex justify-center items-center py-1.5 px-3 text-[13px] sm:text-sm rounded text-white cursor-pointer font-semibold transition-all duration-200 transform active:scale-95 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm";

  const variants = {
    primary: "bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-700",
    secondary: "bg-gray-700 hover:bg-gray-800 focus:ring-gray-700",
    danger: "bg-rose-700 hover:bg-rose-800 focus:ring-rose-700",
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {txt}
    </button>
  );
};
