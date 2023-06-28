const path = require("path");

const uploadFile = (fileExtensions, key) => {
  return (req, res, next) => {
    const file = req.files?.[key];

    if (!file) return next();

    const extName = path.extname(file.name);

    if (!fileExtensions.includes(extName))
      return res
        .status(400)
        .json({ status: "error", message: "Invalid file extension" });

    // generate random file name
    const fileName = `${Math.random().toString(36).substring(2, 15)}${extName}`;

    // generate file path
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      "posts",
      fileName
    );

    // move file to generated path
    file.mv(filePath, (err) => {
      if (err) return res.status(500).json({ status: "error", message: err });
    });
    req.filePath = `uploads/posts/${fileName}`;
    next();
  };
};

module.exports = uploadFile;
