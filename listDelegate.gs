/**
 * This process works and gives relevant feedback to the user when the process fails.
 * I have disabled all logging to console, but keeping it in the code, for easy debugging in the future.
 */

function listGmailDelegate(getBoxEmail) {
  // Get User/Operator Info
  var userEmail = Session.getActiveUser().getEmail();
  // console.log("userEmail: " + userEmail);
  // Grab username from the first input, line below is for testing here in the editor
  // var getBoxEmail = "gafe-task-force@kunskapsskolan.se";
  var boxEmail = getBoxEmail;
  // console.log("getBoxEmail: " + getBoxEmail);
  // For each line, try to list the user with given data, and log the result
  // list = getBoxEmail;
  // for (let i = 0; i < list.length; i++) {
  try {
    // Check to see if userEmail has service account access to boxEmail
    // If not, go straight to else to see why, or to catch if it is an account without delegates
    var serviceList = getListDelegationService_(boxEmail);
    if (serviceList.hasAccess()) {
      // Prepare the data to be included in the UrlFetccApp call
      var options = {
        "method": "GET",
        "contentType": "application/json",
        "muteHttpExceptions": true,
        "headers": {
          "Authorization": 'Bearer ' + serviceList.getAccessToken()
        }
      };
      var url = 'https://gmail.googleapis.com/gmail/v1/users/' + boxEmail +
        '/settings/delegates';
      // Run the actual API call by fetching a URL with the necessary information included
      var response = UrlFetchApp.fetch(url, options);
      // console.log("resonse: ",response);
      var delegateList = JSON.parse(response)
      // console.log("delegateList: ",delegateList);
      var checkforErrors = response.toString();
      // console.log("checkforErrors: ",checkforErrors);
      var errorPermissionDenied = "PERMISSION_DENIED";
      // Check error message against the known error errorPermissionDenied and react accordingly
      if (checkforErrors.includes(errorPermissionDenied)) {
        // console.log("Delegation denied for " + boxEmail);
        return ("Delegation denied for " + boxEmail);
      } else {
        // console.log("Returning array of delegates",[delegateList])
        return ([delegateList]);
      }
    } else {
      // Deal with the error message from the API
      // Convert error message to a string
      var checkElseError = serviceList.getLastError();
      var checkElse = checkElseError.toString();
      var errorInvalidRequest = "invalid_request";
      var errorInvalidGrant = "invalid_grant";
      // Check error message against the two known errors errorInvalidRequest & errorInvalidGrant and react accordingly
      if (checkElse.includes(errorInvalidRequest)) {
        // console.log("FAILED LIST Request - Failed to list delegates of " + boxEmail + " - check spelling");
        return ("FAILED LIST Request - Failed to list delegates of " + boxEmail + " - check spelling");
      } else if (checkElse.includes(errorInvalidGrant)) {
        // console.log("FAILED LIST Grant - Failed to list delegates of " + boxEmail + " - check spelling");
        return ("FAILED LIST Grant - Failed to list delegates of " + boxEmail + " - check spelling");
      }
      else {
        // console.log(checkElse);
        // console.log("FAILED LIST - Failed to list delegates of " + boxEmail + " - reason unknown");
        return ("FAILED LIST - Failed to list delegates of " + boxEmail + " - reason unknown");
      }
    }
    // If the list fails for some reason, log the error
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      throw err; // rethrow
      // I don't know how to deal with unknown error types, but there also shouldn't be any
      // console.log(err);
      // return ("Some unknown error"); // Apparently this is unreachable after the throw
    }
    else if (err instanceof SyntaxError) {
      // Deal with the error message from the API
      // Since I have verified that SyntaxError always means account is not delegated, print that in the log
      // console.log(boxEmail + " is not delegated");
      return (boxEmail + " is not delegated");
    }
  } finally {
  }
  // }
}

/**
 * Do I really need three separate services, just because I have three different actions?
 * Create, Delete & List
 * I don't know, so keeping them all for now.
 */

function getListDelegationService_(boxEmail) {
  return OAuth2.createService('Gmail:' + boxEmail)
    // Set the endpoint URL.
    .setTokenUrl('https://oauth2.googleapis.com/token')
    // Set the private key and issuer. Values taken from secrets.gs.
    .setPrivateKey(PRIVATE_KEY)
    .setIssuer(CLIENT_EMAIL)
    // Set the name of the user to impersonate.
    .setSubject(boxEmail)
    // Set the property store where authorized tokens should be persisted.
    .setPropertyStore(PropertiesService.getScriptProperties())
    // Set the scope. This must match the scopes configured during the
    // setup of domain-wide delegation.
    .setScope(['https://www.googleapis.com/auth/gmail.settings.basic', 'https://www.googleapis.com/auth/gmail.settings.sharing']);
}
