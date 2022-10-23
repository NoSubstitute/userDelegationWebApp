function doGet(e) {
  if (Session.getActiveUser().getEmail() != "user.with@access.here") {
    var t = HtmlService.createTemplateFromFile("pageNoKey");
    return t.evaluate().setTitle("userDelegation No Access");
  } else if (e.parameter.key == "SomePasswordHere") {
    var t = HtmlService.createTemplateFromFile("page");
    return t.evaluate().setTitle("userDelegation").setFaviconUrl('https://docs.google.com/drawings/d/12YbL9mzvKEdThtAwG1wYDEsa0juceV3S_3IhEBYoDDU/export/png');
  }
  var t = HtmlService.createTemplateFromFile("pageNoKey");
  return t.evaluate().setTitle("userDelegation No Access");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
