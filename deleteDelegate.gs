/**
 * This process works and gives relevant feedback to the user when the process fails.
 */

function deleteGmailDelegate(getBoxEmail, uname) {
  // Get User/Operator Info
  var userEmail = Session.getActiveUser().getEmail();
  // Grab usernames from the input
  var boxEmail = getBoxEmail;
  var delegatee = uname;
  // Try to update the user with given data, and log the result.
  try {
    // Check to see if userEmail has service account access to boxEmail
    var serviceDelete = getDeleteDelegationService_(boxEmail);
    if (serviceDelete.hasAccess()) {
      // Prepare the data to be included in the UrlFetccApp call
      var options = {
        "method": "DELETE",
        "contentType": "application/json",
        "muteHttpExceptions": true,
        "headers": {
          "Authorization": 'Bearer ' + serviceDelete.getAccessToken()
        }
      };
      var url = 'https://www.googleapis.com/gmail/v1/users/' + boxEmail +
        '/settings/delegates/' + delegatee;
      // Run the actual API call by fetching a URL with the necessary information included
      var response = UrlFetchApp.fetch(url, options);
      // Logging each code inside their own loop to avoid unnecessary logging
      var responsecode = response.getResponseCode();
      if (responsecode == "204") {
        return ("SUCCESSFUL DELETION - Deleted " + delegatee + " from " + boxEmail);
      } else if (responsecode == "404") {
        return ("FAILED DELETION - Failed to delete " + delegatee + " from " + boxEmail + " - check spelling of delegate");
      } else {
        return ("FAILED DELETION - Failed to delete " + delegatee + " from " + boxEmail + " - check spellings");
      }
    } else {
      // If deletion doesn't work, check the error reponse and log known reasons.
      var checkElseError = serviceDelete.getLastError();
      var checkElse = checkElseError.toString();
      // Both these errors means that the boxEmail is invalid, but I separate them into two processes anyway.
      var errorInvalidRequest = "invalid_request";
      var errorInvalidGrant = "invalid_grant";
      if (checkElse.includes(errorInvalidRequest)) {
        return ("FAILED DELETION - Invalid Request - " + boxEmail + " is invalid - check spelling");
      } else if (checkElse.includes(errorInvalidGrant)) {
        return ("FAILED DELETION - Invalid Grant - " + boxEmail + " is invalid - check spelling");
      }
      else {
        return ("FAILED DELETION - Failed to delete " + delegatee + " from " + boxEmail + " - unknown reason");
      }
    }
    // If the delete fails for some reason, log the error
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      throw err; // rethrow (I don't know how to deal with this error, even if it rarely happens.)
    }
    else {
      // Deal with the error message from the API
      var checkErrMessage = err.message;
      var checkErr = checkErrMessage.toString();
      var errorInvalidArgument = "Invalid argument";
      var errorUnexpectedTokenE = "Unexpected token: E";
      var errorUnexpectedToken = "Unexpected token: <";
      if (checkErr.includes(errorInvalidArgument)) {
        return ("FAILED DELETION - Delegate " + delegatee + " is invalid - check spelling");
      } else if (checkErr.includes(errorUnexpectedTokenE)) {
        return ("FAILED DELETION - Failed to delete " + delegatee + " from " + boxEmail + " - some other unknown reason?");
      } else if (checkErr.includes(errorUnexpectedToken)) {
        return ("FAILED DELETION - Failed to delete " + delegatee + " from " + boxEmail + " - Did you supply a delegate to remove?");
      } else {
        return ("FAILED DELETION - Either " + boxEmail + " or " + delegatee + " is invalid - check spelling");
      }
    }
  } finally {
  }
}

/**
 * Do I really need three separate services, just because I have three different actions?
 * Create, Delete & List
 * I don't know, so keeping them all for now.
 */

function getDeleteDelegationService_(boxEmail) {
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
    // Set the scope. This must match one of the scopes configured during the
    // setup of domain-wide delegation.
    .setScope(['https://www.googleapis.com/auth/gmail.settings.basic', 'https://www.googleapis.com/auth/gmail.settings.sharing']);
}
