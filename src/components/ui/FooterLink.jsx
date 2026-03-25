export const FooterLink = ({ href, children }) => {
  return (
    <a className="text-white transition hover:text-white/75" href={href}>
      {children}
    </a>
  );
};


export const IconLink = ({ href, children, label }) => {
  return (
    <a className="text-white transition hover:text-white/75" href={href} target="_blank" rel="noreferrer">
      <span className="sr-only"> {label} </span>
      {children}
    </a>
  );
}