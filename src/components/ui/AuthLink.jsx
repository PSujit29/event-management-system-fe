import { NavLink } from "react-router-dom";


export const RedirectLink = ({ to = "/", txt = "Go to Home", className = "", variant = "button" }) => {
  const variants = {
    button:
      "block w-full border border-emerald-800 bg-emerald-50 rounded-full text-center font-semibold transition-all duration-200 hover:bg-emerald-100 hover:scale-[0.98] active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-1 py-1.5 px-3 text-[13px] sm:text-sm shadow-sm",

    link: "inline-block  hover:underline font-semibold transition-colors duration-200 hover:text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-1 rounded-sm text-[12px] sm:text-[13px]",
  };

  return (
    <NavLink to={to} className={`text-emerald-800 ${variants[variant]} ${className}`}>
      {txt}
    </NavLink>
  );
};
