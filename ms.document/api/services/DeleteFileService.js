/**
 * Created by aravindhanchandrasekar on 24/5/17.
 */
'use strict';
const errorCodeService = require('./ErrorCodeService');
const aws = require('aws-sdk');
const logger = require('./LoggerService');

let DeleteFilesService = {
  deleteFilesByKeyNameList(keyNameList,callback) {
    try {
    if (!Array.isArray(keyNameList) || keyNameList.length ===0) {
      return callback(null,null);
    }
    aws.config = {"accessKeyId": sails.s3AccessKey, "secretAccessKey": sails.s3SecretAccessKey, "region": sails.s3Region};
    let s3 = new aws.S3();
    var params={};
    params.Bucket=sails.s3bucketName.toString();
    params.Delete={};
    params.Delete.Objects=[];
    keyNameList.forEach(function(obj){
      let delObj ={};
      delObj.Key =obj.toString();
      params.Delete.Objects.push(delObj);
      }

    );
    s3.deleteObjects(params, function(err, data) {
      if (err) {
       logger.error("deleteFilesByKeyNameList ",err); // an error occurred

return callback(errorCodeService.genericInternalErrorCode(),null);
      }
                   // successful response

return callback(null,data);


    });
    } catch (e) {
      logger.error("deleteFilesByKeyNameList exception caught ",e); // an error occurred

      return callback(errorCodeService.genericInternalErrorCode(),null);
    }
  }

};
module.exports = DeleteFilesService;
