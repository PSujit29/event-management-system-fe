export default function Navbar() {
  return (
    <header className="bg-gray-100/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="block text-teal-600" href="#">
          <span className="sr-only">Home</span>
          <img className="h-12 w-auto" src="src\assets\logo.png" alt="Event Management System Logo" />
        </a>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#">
                  {" "}
                  Explore Events{" "}
                </a>
              </li>

              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#">
                  {" "}
                  How it Works{" "}
                </a>
              </li>

              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#">
                  {" "}
                  Organizers{" "}
                </a>
              </li>

              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#">
                  {" "}
                  Contact{" "}
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <a
                className="block rounded-md bg-[#1A325E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1a327f]"
                href="/login"
              >
                Login
              </a>

              <a
                className="hidden rounded-md bg-[#F49425] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#F4a925] sm:block"
                href="/register"
              >
                Register
              </a>
            </div>

            <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg xmlns="http://www.w3.org" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
