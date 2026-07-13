// gatsby-ssr.js
exports.onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({
    className: "bg-background font-sans antialiased",
  });
}
