const path = require("path");
const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
// https://github.com/imagemin/imagemin-webp/issues/23
// Better to run as pre-build step
(async () => {
  const img = await imagemin([path.resolve(__dirname, "src/static/images/*.{jpg,png}").replace(/\\/g, "/")], {
    destination: path.resolve(__dirname, "src/static/images/").replace(/\\/g, "/"),
    plugins: [imageminWebp({ quality: 70 })]
  });
  console.log(img);
  console.log("Done converting images");
})();
