export default function Navbar() {
  const navLinks = [
    { name: "Explore Events", href: "#" },
    { name: "How it Works", href: "#" },
    { name: "Organizers", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    // Sticky and Glass Effect
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Made slightly larger for impact */}
        <a className="flex items-center gap-2" href="/">
          <img className="h-10 w-auto sm:h-12" src="src/assets/logo.png" alt="Logo" />
        </a>

        {/* Navigation Links */}
        <nav aria-label="Global" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[15px] font-medium text-slate-600">
            {navLinks.map((link) => (
              <li key={link.name} className="relative group">
                <a className="transition hover:text-[#1A325E]" href={link.href}>
                  {link.name}
                </a>
                {/* Animated Underline */}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#F49425] transition-all group-hover:w-full"></span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <a className="rounded-lg px-5 py-2 text-sm font-semibold text-[#1A325E] transition hover:bg-slate-100" href="/login">
              Login
            </a>

            <a
              className="hidden rounded-lg bg-[#F49425] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:bg-[#e0861d] hover:scale-105 active:scale-95 sm:block"
              href="/register"
            >
              Register
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="inline-flex rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 md:hidden">
            <span className="sr-only">Open menu</span>
            <svg xmlns="http://www.w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
