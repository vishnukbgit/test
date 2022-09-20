/**
 * Created by aravindhanchandrasekar on 23/5/17.
 */
'use strict';
const errorCodeService = require('./ErrorCodeService');
const aws = require('aws-sdk');
const deleteFileService= require('./DeleteFileService');
const logger = require('./LoggerService');
let FileUploadService = {
uploadFile(keyName,base64String,contentType,callback){
  try {
  aws.config = {"accessKeyId": sails.s3AccessKey, "secretAccessKey": sails.s3SecretAccessKey, "region": sails.s3Region};
  let buf=null;
  if (contentType.toString().trim().toLowerCase() === 'image/jpeg'.toString().trim().toLowerCase()) {
    buf = new Buffer(base64String.replace(/^data:image\/\w+;base64,/, ""),'base64');
  } else if (contentType.toString().trim().toLowerCase() === 'application/pdf'.toString().trim().toLowerCase()) {
    buf = new Buffer(base64String.replace(/^data:application\/\w+;base64,/, ""),'base64');
  } else {
    buf = new Buffer(base64String,'base64');
  }
  var s3Bucket = new aws.S3({params: {Bucket: sails.s3bucketName.toString()}});
  let data = {
    Key: keyName,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: contentType
  };
  s3Bucket.upload(data, function(err, data){
    if (err) {
      logger.error("upload Error logged ",err);

      return callback(err,null);
    }
    else if (data) {
        console.log("s3 data ",data);
        return callback(null, data);
    }

  });
  } catch (e) {
      logger.error("uploadFile exception "+e);

return callback(errorCodeService.genericInternalErrorCode(),null);
  }
},
  processAndUploadFiles(attachmentList,callback){
  let error = null;
  let response ={};
  response.isUploadError = false;
  response.uploadedFilesKeyList =[];
  try {
     if (Array.isArray(attachmentList)) {
       let filesToProcessArray =[];
       attachmentList.forEach(function(obj) {
           if (obj.key && obj.key.toString().length > 0 && obj.base64String && obj.base64String.toString().length > 0 && obj.contentType && obj.contentType.toString().length > 0) {

             filesToProcessArray.push(obj);
           }
         }
      );
       if (filesToProcessArray.length ===0) {
         return callback(null,response);
       }
       FileUploadService.uploadFilesFromArray(filesToProcessArray,
         function(isError,uploadedFilesKeyList) {
         if (isError && isError ===true) {
             logger.error("Error : uploadFilesFromArray",null);

           deleteFileService.deleteFilesByKeyNameList(uploadedFilesKeyList,
           function(err,response){
             if (err) {
                 logger.error("Error",err);
             }
             response.isUploadError = true;
             response.uploadedFilesKeyList = [];

             return callback(null,response);
           });
      }
           response.uploadedFilesKeyList = uploadedFilesKeyList;

return callback(null,response);


         }

       );
     } else {
       return callback(null,response);
     }
  } catch (e) {
      logger.error("ProcessAndUploadFiles exception caught ",e);

return callback(errorCodeService.genericInternalErrorCode(),null);
  }
  },
  uploadFilesFromArray(filesToProcessArray,callback) {
    let uploadedFilesKeyList=[];
    let isError = false;
    try {
      let filesToUploadCount = filesToProcessArray.length;
    let uploadedFilesCount =0;

    filesToProcessArray.forEach(function(obj) {

        FileUploadService.uploadFile(obj.key.toString(),obj.base64String.toString(),obj.contentType.toString(),function(err,response){
          if (err) {
              logger.error("Error",err);
            isError = true;
              uploadedFilesCount++;
          }
          if (response) {

            uploadedFilesKeyList.push(response.Key);
              uploadedFilesCount++;
          }

          if (uploadedFilesCount>= filesToUploadCount) {
            return callback(isError,uploadedFilesKeyList);
          }
            }

        );

      }
    );
    } catch (e) {
        logger.error("uploadFilesFromArray ",e);
     isError = true;

return callback(isError,uploadedFilesKeyList);
    }
  }

};
module.exports = FileUploadService;
