const Alert = ({ kind = "info", children }) => {
  if (!children) return null;
  return <div className={`alert alert-${kind}`}>{children}</div>;
};

export default Alert;
