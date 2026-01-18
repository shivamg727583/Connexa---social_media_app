import PropTypes from "prop-types";


const Logo = ({ size = "default" }) => (
  <div className="flex items-center gap-2">
    <div className={`${size === "small" ? "w-8 h-8" : "w-10 h-10"} bg-gradient-to-br from-purple-600 to-pink-600 rounded-${size === "small" ? "lg" : "xl"} flex items-center justify-center`}>
      <span className={`text-white font-bold ${size === "small" ? "text-base" : "text-xl"}`}>C</span>
    </div>
    <h1 className={`font-bold ${size === "small" ? "text-xl" : "text-2xl"} bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
      Connexa
    </h1>
  </div>
);

Logo.propTypes = {
  size: PropTypes.oneOf(["default", "small"]),
};

export default Logo;