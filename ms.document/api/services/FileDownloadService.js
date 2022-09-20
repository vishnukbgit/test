/**
 * Created by aravindhanchandrasekar on 23/5/17.
 */
'use strict';
const errorCodeService = require('./ErrorCodeService');
const aws = require('aws-sdk');
const jpgContentType="data:image/jpeg;base64,";
const pdfContentType="data:application/pdf;base64,";
const jpgExtension ='.jpg';
const jpegExtension ='.jpeg';
const pdfExtension ='.pdf';
const logger = require('./LoggerService');

let FileDownloadService = {
downloadFile(keyName,callback){
   try {
  aws.config = {"accessKeyId": sails.s3AccessKey, "secretAccessKey": sails.s3SecretAccessKey, "region": sails.s3Region};
  let s3 = new aws.S3();
  let getParams = {
    Bucket: sails.s3bucketName.toString(), // your bucket name,
    Key: keyName // path to the object you're looking for
  };
  s3.getObject(getParams, function(err, data) {
    // Handle any error and exit
    if (err) {
      logger.error("downloadFile error "+keyName,err);

      return callback(err,null);
    }

    // No error happened
    // Convert Body from a Buffer to a String
    let file = new Buffer(data.Body, 'binary');
    let attachment = file.toString('base64');
    if (keyName.toString().toLowerCase().
        trim().
        endsWith(jpgExtension) || keyName.toString().toLowerCase().
        trim().
        endsWith(jpegExtension)) {
      attachment = jpgContentType+attachment;
    } else if (keyName.toString().toLowerCase().
        trim().
        endsWith(pdfExtension)) {
      attachment = pdfContentType+attachment;
    }
    let responseObject ={};
    responseObject.key = keyName;
    responseObject.base64String= attachment;

    return callback(null,responseObject);
  });
  } catch (e){
    logger.error("downloadFile exception caught ",e);

       return callback(errorCodeService.genericInternalErrorCode(),null);
     }
},
  processAndDownloadFiles(keyNameList,callback){
    let response ={};
    let filesToDownloadArray =[];
    response.isDownloadError = false;
    response.downloadedFilesKeyList =[];
    try {
      if (Array.isArray(keyNameList)) {
        keyNameList.forEach(function(obj) {
          if (obj.toString().trim().length>0){
            filesToDownloadArray.push(obj);
          }
            }
          );
        if (filesToDownloadArray.length ===0) {
          return callback(null,response);
        }
        FileDownloadService.downloadFilesFromKeyListArray(filesToDownloadArray,
          function(isError,resObj) {
            if (isError && isError ===true) {
                logger.error("downloadFilesFromKeyListArray error ",null);
              //delete files and send error response
              response.isDownloadError = true;

              return callback(null,response);
            }
            response.downloadedFilesKeyList = resObj;

            return callback(null,response);


          }

        );
      } else {
        return callback(null,response);
      }
    } catch (e) {
        logger.error("processAndDownloadFiles exception caught ",e);

      return callback(errorCodeService.genericInternalErrorCode(),null);
    }
  },
  downloadFilesFromKeyListArray(filesToProcessArray,callback) {
    let downloadedFilesKeyList=[];
    let isError = false;
    try {
      let filesToUploadCount = filesToProcessArray.length;
      let downloadedFilesCount =0;

      filesToProcessArray.forEach(function(obj) {

          FileDownloadService.downloadFile(obj.toString(),function(err,response){
              if (err) {
                  logger.error("Error",err);
                isError = true;
              }
              if (response) {
                downloadedFilesKeyList.push(response);
              }
            downloadedFilesCount++;
              if (downloadedFilesCount>= filesToUploadCount) {
                return callback(isError,downloadedFilesKeyList);
              }
            }

          );

        }
      );
    } catch (e) {
        logger.error("downloadFilesFromArray exception ",e);
      isError = true;

      return callback(isError,downloadedFilesKeyList);
    }
  }

};
module.exports = FileDownloadService;
