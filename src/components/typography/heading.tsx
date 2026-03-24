import type { ReactNode } from "react";

export interface IHeading1Props {
  pageTitle?: string;
  className?: string;
}
export interface ISubHeadingProps {
  children?: ReactNode;
  className?: string;
}

export const Heading1 = ({
  pageTitle = "Default - Heading",
  className='',
}: Readonly<IHeading1Props>) => {
  return <h1 className={`text-4xl font-bold mb-2.5  ${className}`}>{pageTitle}</h1>;
};

export const SubHeading = ({
  children = "Default - SubHeading",
  className='',
}: Readonly<ISubHeadingProps>) => {
  return <div className={`${className}`}>{children}</div>;
};
