/**
 * Created by aravindhanchandrasekar on 4/4/17.
 */

const aws = require('aws-sdk');
const moment = require('moment');
const errorCodeService = require('./ErrorCodeService');
const _=require('underscore');
const generalTemplateName ='general';
const messageTemplateName ='message';
const tpApprovalEmailToPatient ='treatment-plan-approved-patient';
const taskReminderEmailToPatient = 'patient-task-reminder';
const logger = require('./LoggerService');
const utilsService = require('./utilsService');

let EmailService = {

  sendMessageNotification(toEmailAddresses,userId,callback) {
    let error=null;
    try {

      EmailService.getEmailConfig(function(err,emailCfg) {
        if (err) {
          logger.error(" Email configs not found",err);

return callback(err);
        }
        // load aws config
        aws.config = {
          accessKeyId: emailCfg.email_access_key,
          secretAccessKey: emailCfg.email_secret_access_key,
          region: emailCfg.email_region
        };
        // load AWS SES
        let ses = new aws.SES({apiVersion: '2010-12-01'});
        UserAccount.findOne({id: userId},function(err,user) {
          if (err) {
            logger.error("Error finding user_account: "+userId,err);

            return callback(utilsService.makeErrQuery(err),null);
          }
          if (!user) {
            logger.error("User not found: "+userId,null);

            return callback(utilsService.makeErrNotFound("User not found "+userId));
          }
          EmailService.getEmailTemplate(messageTemplateName,
            function(err,template) {
              if (err) {
                error= errorCodeService.genericInternalErrorCode();
                logger.error("email template not found",null);
              } else {
                let to = EmailService.getToAddresses(toEmailAddresses,user,emailCfg);
                //let html_body = template.html_body.toString().replace(emailCfg.email_environmentnameplaceholder,emailCfg.email_environmentname) ;
                let html_body = template.html_body.split(emailCfg.email_environmentnameplaceholder).join(emailCfg.email_environmentname);
                //let text_body = template.text_body.toString().replace(emailCfg.email_environmentnameplaceholder,emailCfg.email_environmentname) ;
                let text_body = template.text_body.split(emailCfg.email_environmentnameplaceholder).join(emailCfg.email_environmentname);

                let request ={};
                request.Source = emailCfg.email_fromemailaddress;
                request.Destination = {ToAddresses:to};
                request.Message = {Subject:{},Body:{Html:{},Text:{}}};
                request.Message.Subject.Data = template.subject;
                request.Message.Body.Html.Data = html_body;
                request.Message.Body.Text.Data = text_body;


                ses.sendEmail(request,function(err, data) {
                  if (err) {

                    logger.error("Error",err);
                    //callback(err,null);
                  }
                });

                return callback(null,"ok");
              }
            }
          );
        });
      });

    } catch (e) {
      logger.error("exception caught ",e);
      error = errorCodeService.genericInternalErrorCode();

return callback(error,null);
    }
  },

  sendGenericNotification(toEmailAddresses,userId,callback) {
    let error=null;

    try {

      EmailService.getEmailConfig(function(err,emailCfg) {
        if (err) {
          logger.error(" Email configs not found",err);

return callback(err);
        }
        // load aws config
        aws.config = {
          accessKeyId: emailCfg.email_access_key,
          secretAccessKey: emailCfg.email_secret_access_key,
          region: emailCfg.email_region
        };
        // load AWS SES
        let ses = new aws.SES({apiVersion: '2010-12-01'});
        UserAccount.findOne({id: userId},function(err,user) {
          if (err) {
            logger.error("Error finding user_account: "+userId,err);

            return callback(utilsService.makeErrQuery(err),null);
          }
          if (!user) {
            logger.error("Error User not found: ",null);

            return callback(utilsService.makeErrNotFound("User not found " + userId));
          }
          EmailService.getEmailTemplate(generalTemplateName,
            function(err,template) {
              if (err) {
                error = errorCodeService.genericInternalErrorCode();
                logger.error("email template not found",null);
              } else {
                let to = EmailService.getToAddresses(toEmailAddresses,user,emailCfg);
                 //let html_body = template.html_body.toString().replace(emailCfg.email_environmentnameplaceholder,emailCfg.email_environmentname) ;
                let html_body = template.html_body.split(emailCfg.email_environmentnameplaceholder).join(emailCfg.email_environmentname);
                 //let text_body = template.text_body.toString().replace(emailCfg.email_environmentnameplaceholder,emailCfg.email_environmentname) ;
                let text_body = template.text_body.split(emailCfg.email_environmentnameplaceholder).join(emailCfg.email_environmentname);

                let request ={};
                request.Source = emailCfg.email_fromemailaddress;
                request.Destination = {ToAddresses:to};
                request.Message ={Subject:{},Body:{Html:{},Text:{}}};
                request.Message.Subject.Data = template.subject;
                request.Message.Body.Html.Data = html_body;
                request.Message.Body.Text.Data = text_body;


                ses.sendEmail(request,function(err, data) {
                  if (err) {
                     //TODO handle error . No requirement as such to handle email failures yet.
                    logger.error("Error",err);
                     //callback(err,null);
                  }
                });

                return callback(null,"ok");
              }
            }
          );
        });
      });
    } catch (e) {
      logger.error("exception caught ",e);
      error = errorCodeService.genericInternalErrorCode();

return callback(error,null);
    }
  },
  sendTaskReminderEmailToPatient(toEmailAddresses,numberOfTasks,dueInHoursMessage,callback) {
    let error=null;
    let response =null;
    try {
      EmailService.getEmailConfig(function(err,emailCfg) {
        if (err) {
          logger.error(" Email configs not found", err);

return callback(err);
        }
        // load aws config
        aws.config = {
          accessKeyId: emailCfg.email_access_key,
          secretAccessKey: emailCfg.email_secret_access_key,
          region: emailCfg.email_region
        };
        // load AWS SES
        let ses = new aws.SES({apiVersion: '2010-12-01'});
         let treatment_task_message ="a Treatment Task";
         let task_singular_plural = "task";
         if (parseInt(numberOfTasks,10) >1) {
           treatment_task_message =parseInt(numberOfTasks,10)+" Treatment Tasks";
           task_singular_plural = "tasks";
         }
          EmailService.getEmailTemplate(taskReminderEmailToPatient,
            function (err, template) {
              if (err) {
                error = errorCodeService.genericInternalErrorCode();
                logger.error("email template not found",null);
              } else {
                let user={};
                user.user_role_id =8;
                let to = EmailService.getToAddresses(toEmailAddresses,user,emailCfg);
                let mergeData = {
                  server: emailCfg.email_environmentname,
                  email_logo: emailCfg.email_logo,
                  link: emailCfg.email_environmentname,
                  date: moment().format("Do MMMM YYYY"),
                  treatment_task_message,
                  treatment_task_due_in:dueInHoursMessage,
                  task_singular_plural
                };
                let tt = _.template(template.html_body);
                let html_body = tt(mergeData);
                tt = _.template(template.text_body);
                let text_body = tt(mergeData);
                let request = {};
                request.Source = emailCfg.email_fromemailaddress;
                request.Destination = {ToAddresses: to};
                request.Message = {Subject: {}, Body: {Html: {}, Text: {}}};
                request.Message.Subject.Data = template.subject;
                request.Message.Body.Html.Data = html_body;
                request.Message.Body.Text.Data = text_body;


                ses.sendEmail(request, function (err, data) {
                  if (err) {

                    logger.error("Error",err);
                    //callback(err,null);
                  }
                });

return callback(null, "ok");
              }
            }
          );

      });

    } catch (e) {
      logger.error("exception caught ",e);
      error = errorCodeService.genericInternalErrorCode();

return callback(error,null);
    }
  },

  sendTPApprovalNotificationToPatient(toEmailAddresses,userId,callback) {
    let error=null;
    let response =null;
    try {
      EmailService.getEmailConfig(function(err,emailCfg) {
        if (err) {
          logger.error(" Email configs not found", err);

return callback(err);
        }
        // load aws config
        aws.config = {
          accessKeyId: emailCfg.email_access_key,
          secretAccessKey: emailCfg.email_secret_access_key,
          region: emailCfg.email_region
        };
        // load AWS SES
        let ses = new aws.SES({apiVersion: '2010-12-01'});
        UserAccount.findOne({id: userId},function(err,user) {
          if (err) {
            logger.error("Error finding user_account: "+userId,err);

            return callback(utilsService.makeErrQuery(err),null);
          }
          if (!user) {
            logger.error("User not found",null);

            return callback(utilsService.makeErrNotFound("User not found "+userId));
          }
          EmailService.getEmailTemplate(tpApprovalEmailToPatient,
            function (err, template) {
              if (err) {
                error = errorCodeService.genericInternalErrorCode();
                logger.error("email template not found",null);
              } else {
                let to = EmailService.getToAddresses(toEmailAddresses,user,emailCfg);
                let mergeData = {
                  server: emailCfg.email_environmentname,
                  email_logo: emailCfg.email_logo,
                  link: emailCfg.email_environmentname,
                  date: moment().format("Do MMMM YYYY")
                };
                let tt = _.template(template.html_body);
                let html_body = tt(mergeData);
                tt = _.template(template.text_body);
                let text_body = tt(mergeData);
                let request = {};
                request.Source = emailCfg.email_fromemailaddress;
                request.Destination = {ToAddresses: to};
                request.Message = {Subject: {}, Body: {Html: {}, Text: {}}};
                request.Message.Subject.Data = template.subject;
                request.Message.Body.Html.Data = html_body;
                request.Message.Body.Text.Data = text_body;


                ses.sendEmail(request, function (err, data) {
                  if (err) {
                    //TODO handle error . No requirement as such to handle email failures yet.
                    logger.error("Error",err);
                    //callback(err,null);
                  }
                });

                return callback(null, "ok");
              }
            }
          );
        });
      });

    } catch (e) {
      logger.error("exception caught ",e);
      error = errorCodeService.genericInternalErrorCode();

return callback(error,null);
    }
  },

  getEmailTemplate(name,callback) {
    let error = null;
    let response = null;
    try {

      EmailTemplate.findOne({name}).exec(
        function (err,record) {
          if (err) {

              error = errorCodeService.sqlErrorCode();
              callback(error,response);
            } else if (record) {

            callback(null,record);
          } else {
            callback(errorCodeService.sqlErrorCode(),null);
          }
        }
      );

    } catch (e) {
      error = errorCodeService.sqlErrorCode();
      callback(error,response);
    }
  },

  sendForgotPassword(context,user,callback) {
    try {
      // Read the email configs every time, as they could change, and we don't want to restart
      // the microservice each time we make a change
      EmailService.getEmailConfig(function(err,emailCfg) {
        if (err) {
          logger.error(" Email configs not found",err);

return callback(err);
        }
        try {
          // load aws config
          aws.config = {
            accessKeyId: emailCfg.email_access_key,
            secretAccessKey: emailCfg.email_secret_access_key,
            region: emailCfg.email_region
          };
          // load AWS SES
          let ses = new aws.SES({apiVersion: '2010-12-01'});
          let to = EmailService.getToAddresses(context.email,user,emailCfg);
          UserAccount.update({email: context.email},{user_account_token: context.token},function(error,data) {
            if (error) {
              logger.error("Error updating user_account: ",error);

              return callback(utilsService.makeErrQuery(error),null);
            }

            let mergeData = {
              server: emailCfg.email_environmentname,
              email_logo: emailCfg.email_logo,
              link: emailCfg.email_environmentname+"/resetpassword/"+context.token,
              date: moment().format("Do MMMM YYYY")
            };
            EmailService.getEmailTemplate('reset-password',function(err,template) {
              if (err) {
                logger.error("Error getting email template: ",err);

                return callback(err,null);
              }
              let tt = _.template(template.html_body);
              let htmlBody = tt(mergeData);


              tt = _.template(template.text_body);
              let textBody = tt(mergeData);


              let from = emailCfg.email_fromemailaddress;
              let request = {
                Source: from,
                Destination: {ToAddresses: to},
                Message: {
                  Subject: {Data: "You have requested to reset your password"},
                  Body: {
                    Html: {Data: htmlBody},
                    Text: {Data: textBody}
                  }
                }
              };


              ses.sendEmail(request,function(err, data) {
                if (err) {
                  logger.error(" Amazon Send Email fail",err);

                  return callback(utilsService.makeErrAWS(err.message),null);
                }


                return callback(null,{status: "success"});
              });

            });
          });
        } catch (e) {
          logger.error(" exception caught ",e);

          return callback(utilsService.makeErrException(e.message),null);
        }
      });
    } catch (e) {
      logger.error(" exception caught ",e);

      return callback(utilsService.makeErrException(e),null);
    }
  },

  sendAnEmail(context,callback) {
    let required = ["user_account_id", "url", "template"];
    let failed = false;
    try {
//
// Check the incoming context to make sure we don't tank
//
      _.each(required,(item) => {
        if (!context[item]) {
          failed = true;

return callback(utilsService.makeErrParameter("Required parameter missing: "+item),null);
        }
      });
//
// context.user_account_id can either be an array or an integer, the ORM is ok with that.
//
      UserAccount.find({id: context.user_account_id},function(err,users) {
        if (err) {
          logger.error(" User Account(s) not found",err);
          failed = true;

return callback(err);
        }
        _.each(users,(user) => {
    // Read the email configs every time, as they could change, and we don't want to restart
    // the microservice each time we make a change
          EmailService.getEmailConfig(function(err,emailCfg) {
            if (err) {
              logger.error(" Email configs not found",err);

return callback(err);
            }
            try {
          // load aws config
              aws.config = {
                accessKeyId: emailCfg.email_access_key,
                secretAccessKey: emailCfg.email_secret_access_key,
                region: emailCfg.email_region
              };
              // load AWS SES
              let ses = new aws.SES({apiVersion: '2010-12-01'});
              let to = EmailService.getToAddresses(user.email,user,emailCfg);

              let mergeData = {
                server: emailCfg.email_environmentname,
                email_logo: emailCfg.email_logo,
                link: emailCfg.email_environmentname+context.url,
                date: moment().format("Do MMMM YYYY")
              };
              EmailService.getEmailTemplate(context.template,function(err,template) {
                if (err) {
                  logger.error("Error getting email template: ",err);

                  return callback(err,null);
                }
                let tt = _.template(template.html_body);
                let htmlBody = tt(mergeData);


                tt = _.template(template.text_body);
                let textBody = tt(mergeData);


                let from = emailCfg.email_fromemailaddress;
                let subject = template.subject;
                if (context.subject) {
                  subject = context.subject;
                }
                let request = {
                  Source: from,
                  Destination: {ToAddresses: to},
                  Message: {
                    Subject: {Data: subject},
                    Body: {
                      Html: {Data: htmlBody},
                      Text: {Data: textBody}
                    }
                  }
                };


                ses.sendEmail(request,function(err, data) {
                  if (err) {
                    logger.error(" Amazon Send Email fail",err);

                    return callback(utilsService.makeErrAWS(err.message),null);
                  }


                  return callback(null,{status: "success"});
                });

              });
            } catch (e) {
              logger.error(" exception caught ",e);

              return callback(utilsService.makeErrException(e.message),null);
            }
          });
        });
      });
    } catch (e) {
      logger.error(" exception caught "+e);

return callback(utilsService.makeErrException(e),null);
    }
  },

  getEmailConfig(callback) {
    try {
      let mustHaves = [
        'email_access_key',
        'email_secret_access_key',
        'email_region',
        'email_fromemailaddress',
        'email_environmentname',
        'email_environmentnameplaceholder',
        'email_logo',
        'email_activate_external',
        'email_demo_gp',
        'email_demo_specialist',
        'email_demo_nurse',
        'email_demo_patient'
      ];
      EnvironmentConfigurationSetting.
        find({configuration_name:{'startsWith': 'email'}}).
        exec(function (err,env) {
          if (err) {
              return callback({code: "DB_ERROR", message: err},null);
            }
          if (env) {
            let emailConfigs = {};
            _.each(env,(v) => {
              let key = v.configuration_name.toLowerCase();
              emailConfigs[key] = v.configuration_value;
            });
            let missing = [];
            _.each(mustHaves,(must) => {
              if (!emailConfigs[must]) {
                missing.push(must);
              }
            });
            if (missing.length === 0) {
              return callback(null,emailConfigs);
            }

return callback(utilsService.makeErrNotFound("Missing email configs: "+missing));
          }

return callback(utilsService.makeErrNotFound("Email configs not found"),null);

        }
      );
    } catch (e) {
      return callback(utilsService.makeErrException(e),null);
    }
  },

  getToAddresses(email,user,emailCfg) {
    let to = [email];
    if (emailCfg.email_activate_external === '0') {
      switch (parseInt(user.user_role_id,10)) {
        case 1:
            to = [emailCfg.email_demo_specialist];
            break;
        case 2:
            to = [emailCfg.email_demo_nurse];
            break;
        case 3:
            to = [emailCfg.email_demo_gp];
            break;
        case 8:
            to = [emailCfg.email_demo_patient];
            break;
        default:
            to = ['role_not_found_'+user.user_role_id];
      }
    }

    return to;
  },
  sendPatientTasksReminderEmails(emailAddressAndNumberOfTasks,dueInHours,callback) {
    let counter =0;
    let emailAddress ="";
    let numberOfTasks =0;
    try {
    if (Array.isArray(emailAddressAndNumberOfTasks) && emailAddressAndNumberOfTasks.length >0) {
       for (let i=0; i<emailAddressAndNumberOfTasks.length; i++){
            emailAddress = emailAddressAndNumberOfTasks[i].emailAddress;
            numberOfTasks = emailAddressAndNumberOfTasks[i].taskCount;
            EmailService.sendTaskReminderEmailToPatient(emailAddress,numberOfTasks,dueInHours,
            function(err,response) {
              if (err) {
                return callback(errorCodeService.genericInternalErrorCode(),null);
              }
              counter++;
              if (counter >=emailAddressAndNumberOfTasks.length) {
                return callback(null,"ok");
              }
            }

            );
         }


    } else {
      return callback(null,"ok");
    }
    } catch (e) {
      logger.error("sendPatientTasksReminderEmails exception ",e);

return callback(errorCodeService.genericInternalErrorCode(),null);
    }
  }

};

module.exports = EmailService;
