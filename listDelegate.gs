/**
 * This process works and gives relevant feedback to the user when the process fails.
 */

function listGmailDelegate(getBoxEmail) {
  // Get User/Operator Info
  var userEmail = Session.getActiveUser().getEmail();
  // Grab username from the first input, line below is for testing here in the editor
  // var getBoxEmail = "gafe-task-force@kunskapsskolan.se";
  var boxEmail = getBoxEmail;
  // Try to list the user with given data, and log the result
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
      var delegateList = JSON.parse(response)
      var checkforErrors = response.toString();
      var errorPermissionDenied = "PERMISSION_DENIED";
      // Check error message against the known error errorPermissionDenied and react accordingly
      if (checkforErrors.includes(errorPermissionDenied)) {
        return ("Delegation denied for " + boxEmail);
      } else {
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
        return ("FAILED LIST Request - Failed to list delegates of " + boxEmail + " - check spelling");
      } else if (checkElse.includes(errorInvalidGrant)) {
        return ("FAILED LIST Grant - Failed to list delegates of " + boxEmail + " - check spelling");
      }
      else {
        return ("FAILED LIST - Failed to list delegates of " + boxEmail + " - reason unknown");
      }
    }
    // If the list fails for some reason, log the error
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      throw err; // rethrow
      // I don't know how to deal with unknown error types, but there also shouldn't be any
      // return ("Some unknown error"); // Apparently this is unreachable after the throw
    }
    else if (err instanceof SyntaxError) {
      // Deal with the error message from the API
      // Since I have verified that SyntaxError always means account is not delegated, print that in the log
      return (boxEmail + " is not delegated");
    }
  } finally {
    PropertiesService.getScriptProperties().deleteProperty("oauth2.Gmail:"+boxEmail)
  }
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
