/**
 * This process works and gives relevant feedback to the user when the process fails.
 * I have disabled all logging to console, but keeping it in the code, for easy debugging in the future.
 */

function createGmailDelegate(getBoxEmail, uname) {
  // Get User/Operator Info
  var userEmail = Session.getActiveUser().getEmail();
  // console.log("userEmail: " + userEmail);
  // Grab usernames from the input, lines below is for testing here in the editor
  // var getBoxEmail = "sebcala@kunskapsskolan.se";
  // var uname = "kini@kunskapsskolan.se";
  // var uname = "gafe-task-force@kunskapsskolan.se";
  var boxEmail = getBoxEmail;
  // console.log("getBoxEmail: " + getBoxEmail);
  var delegate = uname;
  // console.log("delegate: " + uname);
  try {
    // Check to see if userEmail has service account access to boxEmail
    var service = getCreateDelegationService_(boxEmail);
    if (service.hasAccess()) {
      // Prepare the data to be included in the UrlFetccApp call
      var payload = {
        "delegateEmail": delegate,
        "verificationStatus": "accepted"
      }
      var options = {
        "method": "POST",
        "contentType": "application/json",
        "muteHttpExceptions": true,
        "headers": {
          "Authorization": 'Bearer ' + service.getAccessToken()
        },
        "payload": JSON.stringify(payload)
      };
      var url = 'https://www.googleapis.com/gmail/v1/users/' + boxEmail +
        '/settings/delegates';
      // Run the actual API call by fetching a URL with the necessary information included
      var response = UrlFetchApp.fetch(url, options);
      var checkResponse = JSON.stringify(JSON.parse(response));
      var acceptedStatus = "accepted";
      var alreadyExists = "ALREADY_EXISTS";
      var missingDelegateEmail = "Missing delegate email"
      var delegateSameAsboxEmail = "Delegate and delegator are the same user"
      var invalidDelegate = "Invalid delegate";
      if (checkResponse.includes(acceptedStatus)) {
        // List delegation to the Log sheet
        // console.log("SUCCESSFUL DELEGATION - Delegated " + boxEmail + " to " + delegate);
        return ("SUCCESSFUL DELEGATION - Delegated " + boxEmail + " to " + delegate);
        // List delegates to the Delegates sheet
      } else if (checkResponse.includes(alreadyExists)) {
        // console.log("FAILED DELEGATION - " + delegate + " is already a delegate of " + boxEmail);
        return ("FAILED DELEGATION - " + delegate + " is already a delegate of " + boxEmail);
      } else if (checkResponse.includes(missingDelegateEmail)) {
        // console.log("FAILED DELEGATION - It seems you forgot to supply a new delegate for " + boxEmail);
        return ("FAILED DELEGATION - It seems you forgot to supply a new delegate for " + boxEmail);
      } else if (checkResponse.includes(delegateSameAsboxEmail)) {
        // console.log("FAILED DELEGATION - Can't delegate to same account. Check spelling of " + boxEmail + " and " + delegate);
        return ("FAILED DELEGATION - Can't delegate to same account. Check spelling of " + boxEmail + " and " + delegate);
      } else if (checkResponse.includes(invalidDelegate)) {
        // console.log("FAILED DELEGATION - It seems " + delegate + " is invalid. Check the spelling");
        return ("FAILED DELEGATION - It seems " + delegate + " is invalid. Check the spelling");
      } else {
        // console.log("FAILED DELEGATION - Failed to delegate " + boxEmail + " to " + delegate);
        return ("FAILED DELEGATION - Failed to delegate " + boxEmail + " to " + delegate);
      }
    } else {
      // If delegation wasn't possible for some other reason try to figure out why, and log that.
      var checkElseError = service.getLastError();
      var checkElse = checkElseError.toString();
      // Both these errors means that the boxEmail is invalid, but I separate them into two processes anyway.
      var errorInvalidRequest = "invalid_request";
      var errorInvalidGrant = "invalid_grant";
      if (checkElse.includes(errorInvalidRequest)) {
        // console.log("FAILED DELEGATION - Invalid Request - " + boxEmail + " is invalid - check spelling");
        return ("FAILED DELEGATION - Invalid Request - " + boxEmail + " is invalid - check spelling");
      } else if (checkElse.includes(errorInvalidGrant)) {
        // console.log("FAILED DELEGATION - Invalid Grant - " + boxEmail + " is invalid - check spelling");
        return ("FAILED DELEGATION - Invalid Grant - " + boxEmail + " is invalid - check spelling");
      }
    }
    // If the create fails for some unknown reason, log the error.
  } catch (err) {
    // console.log("FAIL - " + err);
    return ("FAIL - " + err);
  }
  // }
}

/**
 * Do I really need three separate services, just because I have three different actions?
 * Create, Delete & List
 * I don't know, so keeping them all for now.
 */

function getCreateDelegationService_(boxEmail) {
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
