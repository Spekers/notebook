module.exports = {
  multipass: true,
  plugins: [
    { name: "preset-default" },
    "removeMetadata",
    "removeComments",
    "removeEditorsNSData",
    { name: "removeXMLProcInst", active: true },
  ],
};
