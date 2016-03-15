// YOU DO NOT NEED TO EDIT this code.
//
// All this is doing is inserting the parse API keys into every $.ajax
// request that you make so you don't have to.
if (!/(&|\?)username=/.test(window.location.search)) {
  var newSearch = window.location.search;
  if (newSearch !== '' & newSearch !== '?') {
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

// Put your parse application keys here!
$.ajaxPrefilter(function (settings, _, jqXHR) {
  jqXHR.setRequestHeader("wPfavNOxOKTzlXiMq9r226nSo5Vl5aMFfEcvAupE", "PARSE_APP_ID");
  jqXHR.setRequestHeader("eCGqXWtDjoZofGzf785KvSODrUrXURbL6JCQqaHj", "PARSE_API_KEY");
});
