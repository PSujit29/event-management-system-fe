import { Heading1, SubHeading } from "../../components/typography/heading";

// 1. Left Side Panel
export const AuthLeftSidePanel = ({ title = "D - Hello World", children = <p>Lorem Epsum</p> }) => {
  return (
    <aside className="hidden lg:flex lg:w-1/2 xl:w-1/3 flex-col gap-4 bg-emerald-800 text-white items-center justify-center p-8">
      <Heading1 pageTitle={title} />
      <div className="flex flex-col text-white gap-y-2 text-center px-5 text-sm sm:text-base leading-relaxed">
        <SubHeading className="font-[cursive]">{children}</SubHeading>
      </div>
    </aside>
  );
};

// 2. Right Side Panel
export const AuthRightSidePanel = ({ children }) => {
  return (
    <main className="flex flex-1 flex-col w-full lg:w-1/2 xl:w-2/3 bg-white justify-center items-center overflow-y-auto p-2 sm:p-4">
      {children}
    </main>
  );
};

// 3. Form Container
export const FormContainer = ({ children }) => {
  return (
    <div className="flex flex-col gap-y-3 bg-gray-200 p-4 sm:p-5 md:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      {children}
    </div>
  );
};

// 4. Main Wrapper
export const AuthPanel = ({ children }) => {
  return <section className="flex flex-col lg:flex-row min-h-screen w-full">{children}</section>;
};
