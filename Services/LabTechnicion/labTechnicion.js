const mm = require("../../Utilities/globalModule");
const { validationResult, body } = require("express-validator");
const logger = require("../../Utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;
var labTechnicianMaster = "lab_technicion_master";
var viewLabTechnicianMaster = "view_" + labTechnicianMaster;

function reqData(req) {
  var data = {
    NAME: req.body.NAME,
    QUALIFICATIONS: req.body.QUALIFICATIONS,
    ADDRESS: req.body.ADDRESS,
    MOBILE_NO: req.body.MOBILE_NO,
    GENDER: req.body.GENDER,
    DOB: req.body.DOB,
    ABOUT: req.body.ABOUT,
    EXPERIENCE: req.body.EXPERIENCE,
    SPECIALIZATION_TYPE: req.body.SPECIALIZATION_TYPE,
    SPECIALIZATION: req.body.SPECIALIZATION,
    REGISTRATION_NUMBER: req.body.REGISTRATION_NUMBER,
    ASSIGNED_LABS_ID: req.body.ASSIGNED_LABS_ID,
    FACILITY_ID: req.body.FACILITY_ID,
  };
  return data;
}

exports.validate = function () {
  return [
    body("NAME", "Name parameter missing").exists(),
    body("MOBILE_NO", "Mobile number parameter missing").exists(),
    body("QUALIFICATIONS", "Qualifications parameter missing").exists(),
    body("SPECIALIZATION_TYPE", "Specialization type parameter missing").exists(),
    body("FACILITY_ID", "Facility ID parameter missing").exists(),
    body("ID").optional(),
  ];
};

exports.get = (req, res) => {
  var pageIndex = req.body.pageIndex ? req.body.pageIndex : "";
  var pageSize = req.body.pageSize ? req.body.pageSize : "";
  var start = 0;
  var end = 0;

  if (pageIndex != "" && pageSize != "") {
    start = (pageIndex - 1) * pageSize;
    end = pageSize;
  }

  let sortKey = req.body.sortKey ? req.body.sortKey : "ID";
  let sortValue = req.body.sortValue ? req.body.sortValue : "DESC";
  let filter = req.body.filter ? req.body.filter : "";
  let criteria = "";

  if (pageIndex === "" && pageSize === "")
    criteria = filter + " order by " + sortKey + " " + sortValue;
  else
    criteria =
      filter +
      " order by " +
      sortKey +
      " " +
      sortValue +
      " LIMIT " +
      start +
      "," +
      end;

  let countCriteria = filter;
  var supportKey = req.headers["supportkey"];

  try {
    mm.executeQuery(
      "select count(*) as cnt from " +
        viewLabTechnicianMaster +
        " where 1 " +
        countCriteria,
      supportKey,
      (error, results1) => {
        if (error) {
          console.log(error);
          logger.error(
            supportKey +
              " " +
              req.method +
              " " +
              req.url +
              " " +
              JSON.stringify(error),
            applicationkey
          );
          res.send({
            code: 400,
            message: "Failed to get lab technicians count...",
          });
        } else {
          mm.executeQuery(
            "select * from " + viewLabTechnicianMaster + " where 1 " + criteria,
            supportKey,
            (error, results) => {
              if (error) {
                console.log(error);
                logger.error(
                  supportKey +
                    " " +
                    req.method +
                    " " +
                    req.url +
                    " " +
                    JSON.stringify(error),
                  applicationkey
                );
                res.send({
                  code: 400,
                  message: "Failed to get lab technician information...",
                });
              } else {
                res.send({
                  code: 200,
                  message: "success",
                  count: results1[0].cnt,
                  data: results,
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    logger.error(
      supportKey +
        " " +
        req.method +
        " " +
        req.url +
        " " +
        JSON.stringify(error),
      applicationkey
    );
    console.log(error);
  }
};

exports.getList = (req, res) => {
  var supportKey = req.headers["supportkey"];
  let filter = req.body.filter ? req.body.filter : "";

  try {
    mm.executeQuery(
      "select ID, NAME from " + viewLabTechnicianMaster + " where 1 " + filter,
      supportKey,
      (error, results) => {
        if (error) {
          console.log(error);
          logger.error(
            supportKey +
              " " +
              req.method +
              " " +
              req.url +
              " " +
              JSON.stringify(error),
            applicationkey
          );
          res.send({
            code: 400,
            message: "Failed to get lab technician list...",
          });
        } else {
          res.send({
            code: 200,
            message: "success",
            data: results,
          });
        }
      }
    );
  } catch (error) {
    logger.error(
      supportKey +
        " " +
        req.method +
        " " +
        req.url +
        " " +
        JSON.stringify(error),
      applicationkey
    );
    console.log(error);
  }
};

exports.create = (req, res) => {
  var data = reqData(req);
  const errors = validationResult(req);
  var supportKey = req.headers["supportkey"];

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.send({
      code: 422,
      message: errors.errors,
    });
  } else {
    try {
      mm.executeQueryData(
        "INSERT INTO " + labTechnicianMaster + " SET ?",
        data,
        supportKey,
        (error, results) => {
          if (error) {
            console.log(error);
            logger.error(
              supportKey +
                " " +
                req.method +
                " " +
                req.url +
                " " +
                JSON.stringify(error),
              applicationkey
            );
            res.send({
              code: 400,
              message: "Failed to save lab technician information...",
            });
          } else {
            console.log(results);
            res.send({
              code: 200,
              message: "Lab technician information saved successfully...",
            });
          }
        }
      );
    } catch (error) {
      logger.error(
        supportKey +
          " " +
          req.method +
          " " +
          req.url +
          " " +
          JSON.stringify(error),
        applicationkey
      );
      console.log(error);
    }
  }
};

exports.update = (req, res) => {
  const errors = validationResult(req);
  var data = reqData(req);
  var supportKey = req.headers["supportkey"];
  var criteria = {
    ID: req.body.ID,
  };

  var systemDate = mm.getSystemDate();
  var setData = "";
  var recordData = [];
  Object.keys(data).forEach((key) => {
    data[key] ? (setData += `${key}= ? , `) : true;
    data[key] ? recordData.push(data[key]) : true;
  });

  if (!errors.isEmpty()) {
    console.log(errors);
    res.send({
      code: 422,
      message: errors.errors,
    });
  } else {
    try {
      mm.executeQueryData(
        `UPDATE ` +
          labTechnicianMaster +
          ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `,
        recordData,
        supportKey,
        (error, results) => {
          if (error) {
            logger.error(
              supportKey +
                " " +
                req.method +
                " " +
                req.url +
                " " +
                JSON.stringify(error),
              applicationkey
            );
            console.log(error);
            res.send({
              code: 400,
              message: "Failed to update lab technician information.",
            });
          } else {
            console.log(results);
            res.send({
              code: 200,
              message: "Lab technician information updated successfully...",
            });
          }
        }
      );
    } catch (error) {
      logger.error(
        supportKey +
          " " +
          req.method +
          " " +
          req.url +
          " " +
          JSON.stringify(error),
        applicationkey
      );
      console.log(error);
    }
  }
};

exports.delete = (req, res) => {
  var supportKey = req.headers["supportkey"];
  var recordId = req.body.ID;

  if (!recordId) {
    res.send({
      code: 400,
      message: "ID parameter missing...",
    });
  } else {
    try {
      mm.executeQueryData(
        `DELETE FROM ` + labTechnicianMaster + ` WHERE ID = ?`,
        [recordId],
        supportKey,
        (error, results) => {
          if (error) {
            console.log(error);
            logger.error(
              supportKey +
                " " +
                req.method +
                " " +
                req.url +
                " " +
                JSON.stringify(error),
              applicationkey
            );
            res.send({
              code: 400,
              message: "Failed to delete lab technician information.",
            });
          } else {
            if (results.affectedRows > 0) {
              res.send({
                code: 200,
                message: "Lab technician information deleted successfully...",
              });
            } else {
              res.send({
                code: 404,
                message: "Record not found...",
              });
            }
          }
        }
      );
    } catch (error) {
      logger.error(
        supportKey +
          " " +
          req.method +
          " " +
          req.url +
          " " +
          JSON.stringify(error),
        applicationkey
      );
      console.log(error);
    }
  }
};
