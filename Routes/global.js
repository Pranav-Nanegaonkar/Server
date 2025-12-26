const express = require("express");
const router = express.Router();
var globalService = require("../Services/global.js");

router

  .post("/user/login", require("../Services/UserAccess/user").login)

  //? auth
  .use(globalService.checkAuthorization)
  .use("/api", globalService.checkToken)

  //? ModuleName
  //   .use("/api/project", require("./SuperSet/project"))

  //? User Access
  .use("/api/user", require("./UserAccess/user.js"))

  //? Lab Technician
  .use("/api/labTechnician", require("./LabTechnicion/labTechnicion.js"))

  //? Uploads
  .post("/uploadFilesTos3", globalService.uploadFilesTos3)
  .post("/fileUpload/:folderName", globalService.fileUpload);

module.exports = router;
