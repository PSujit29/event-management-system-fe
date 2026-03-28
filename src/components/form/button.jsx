export const Button = ({ txt = "Button", type = "button", variant = "primary", onClick, className = "" }) => {
  const baseStyles =
    "w-full flex justify-center items-center py-1.5 px-3 text-[13px] sm:text-sm rounded-md cursor-pointer font-semibold transition-all duration-200 transform active:scale-95 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm";

  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400",
    danger: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900",
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {txt}
    </button>
  );
};
