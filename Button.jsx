const Button = ({
  children,
  variant = "primary",
  type = "button",
  block,
  size,
  className = "",
  ...rest
}) => {
  const classes = [
    "btn",
    `btn-${variant}`,
    block ? "btn-block" : "",
    size === "sm" ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
