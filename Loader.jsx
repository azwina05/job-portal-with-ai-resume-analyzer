const Loader = ({ center = false }) =>
  center ? (
    <div className="loader-center">
      <span className="loader" />
    </div>
  ) : (
    <span className="loader" />
  );

export default Loader;
