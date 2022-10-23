function doGet(e){
  
  var t = HtmlService.createTemplateFromFile("page");
  return t.evaluate().setTitle("userDelegation").setFaviconUrl('https://docs.google.com/drawings/d/1z6XM6zDn9tT8NKmaSephC_VUL87tCIdrid_ghJmE1_8/export/png');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}