const mm = require("../../Utilities/globalModule");
const { validationResult, body } = require("express-validator");
const logger = require("../../Utilities/logger");
const jwt = require("jsonwebtoken");

const applicationkey = process.env.APPLICATION_KEY;
var userMaster = "user_master";
var viewUserMaster = "view_" + userMaster;

function reqData(req) {
  var data = {
    NAME: req.body.NAME,
    EMAIL_ID: req.body.EMAIL_ID,
    MOBILE_NUMBER: req.body.MOBILE_NUMBER,
    IS_ACTIVE: req.body.IS_ACTIVE ? "1" : "0",
    PASSWORD: req.body.PASSWORD,
    CLIENT_ID: req.body.CLIENT_ID,
  };
  return data;
}

exports.validate = function () {
  return [
    body("NAME", "Name parameter missing").exists(),
    body("EMAIL_ID", "Email parameter missing").exists(),
    body("MOBILE_NUMBER", "Mobile number parameter missing").exists(),
    body("PASSWORD", "Password parameter missing").exists(),
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
        viewUserMaster +
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
            message: "Failed to get users count...",
          });
        } else {
          mm.executeQuery(
            "select * from " + viewUserMaster + " where 1 " + criteria,
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
                  message: "Failed to get user information...",
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
        "INSERT INTO " + userMaster + " SET ?",
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
              message: "Failed to save user information...",
            });
          } else {
            console.log(results);
            res.send({
              code: 200,
              message: "User information saved successfully...",
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
          userMaster +
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
              message: "Failed to update user information.",
            });
          } else {
            console.log(results);
            res.send({
              code: 200,
              message: "User information updated successfully...",
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

exports.login = (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var supportKey = req.headers["supportkey"];

    if (!username || !password) {
      res.send({
        code: 400,
        message: "Username or password parameter missing...",
      });
    } else {
      mm.executeQuery(
        `SELECT * FROM ${viewUserMaster} WHERE (MOBILE_NUMBER ='${username}' or EMAIL_ID='${username}') and PASSWORD ='${password}' and IS_ACTIVE = 1`,
        supportKey,
        (error, results) => {
          if (error) {
            console.log(error);
            res.send({
              code: 400,
              message: "Failed to get record...",
            });
          } else {
            if (results.length > 0) {
              generateToken(results[0].ID, res, results[0]);
            } else {
              res.send({
                code: 404,
                message: "Incorrect username or password...",
              });
            }
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

exports.changePassword = (req, res) => {
  try {
    var LOGIN_ID = req.body.LOGIN_ID;
    var OLD_PASSWORD = req.body.OLD_PASSWORD;
    var NEW_PASSWORD = req.body.NEW_PASSWORD;
    var supportKey = req.headers["supportkey"];

    if (LOGIN_ID && OLD_PASSWORD && NEW_PASSWORD) {
      mm.executeQueryData(
        `UPDATE ` +
          userMaster +
          ` SET PASSWORD = ? WHERE (MOBILE_NUMBER = ? or EMAIL_ID = ?) AND PASSWORD = ?`,
        [NEW_PASSWORD, LOGIN_ID, LOGIN_ID, OLD_PASSWORD],
        supportKey,
        (error, results) => {
          if (error) {
            console.log(error);
            res.send({
              code: 400,
              message: "Failed to update password!",
            });
          } else {
            if (results.affectedRows > 0) {
              res.send({
                code: 200,
                message: "Password updated successfully.....",
              });
            } else {
              res.send({
                code: 400,
                message: "Invalid old password",
              });
            }
          }
        }
      );
    } else {
      res.send({
        code: 400,
        message: "Required parameters missing.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

function generateToken(userId, res, userData) {
  try {
    var data = {
      USER_ID: userId,
    };
    jwt.sign({ data }, process.env.SECRET, (error, token) => {
      if (error) {
        console.log("token error", error);
      } else {
        res.send({
          code: 200,
          message: "Logged in successfully...",
          data: [
            {
              token: token,
              UserData: userData,
            },
          ],
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
