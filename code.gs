function doGet(e) {
  if (Session.getActiveUser().getEmail() != "user.with@access.here") {
    var t = HtmlService.createTemplateFromFile("pageNoKey");
    return t.evaluate().setTitle("userDelegation No Access");
  } else if (e.parameter.key == "SomePasswordHere") {
    var t = HtmlService.createTemplateFromFile("page");
    return t.evaluate().setTitle("userDelegation").setFaviconUrl('https://docs.google.com/drawings/d/1z6XM6zDn9tT8NKmaSephC_VUL87tCIdrid_ghJmE1_8/export/png');
  }
  var t = HtmlService.createTemplateFromFile("pageNoKey");
  return t.evaluate().setTitle("userDelegation No Access");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}