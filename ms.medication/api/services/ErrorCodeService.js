/**
 * Created by aravindhanchandrasekar on 4/4/17.
 */

/*
	 * * * * WARNING: This file is generated from a template. * * * *
		- You shouldn't edit it, because it will be replaced when the templater is next run
		
*/

'use strict';
let error = {};
let ErrorCodeService = {

  genericInternalErrorCode() {
    error.message = "Internal error";
    error.code = "INTERNAL_ERROR";

    return error;
  },

  sqlErrorCode() {
    error.message = "SQL exception";
    error.code = "SQL_EXCEPTION";

    return error;
  },

  missingParametersErrorCode() {
    error.message = "Missing required parameters";
    error.code = "MISSING_PARAMETERS_EXCEPTION";

    return error;
  },

  invalidRequestCode() {
    error.message = "Invalid Request";
    error.code = "INVALID_REQUEST_EXCEPTION";

    return error;
  },

  validationErrorCode() {
    error.message = "Validation error";
    error.code = "VALIDATION";

    return error;
  },

  exceptionErrorCode() {
    error.message = "Program exception";
    error.code = "EXCEPTION";

    return error;
  },

  notFoundErrorCode() {
    error.message = "Not found";
    error.code = "NOT_FOUND";

    return error;
  },

  parameterErrorCode() {
    error.message = "Missing or invalid parameter(s)";
    error.code = "PARAMETER";

    return error;
  },

  nonSequiturErrorCode() {         // Errors that should never happen
    error.message = "Non sequitur - should never happen";
    error.code = "NON_SEQUITUR";

    return error;
  },

};

module.exports = ErrorCodeService;
