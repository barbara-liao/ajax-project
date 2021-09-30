/* exported data */

var data = {
  bookmarks: [],
  results: [],
  detail: null,
  removeId: 0,
  nextResultId: 0,
  view: '',
  searchPageView: ''
};

var previousResultsJSON = localStorage.getItem('results-list');

if (previousResultsJSON !== null) {
  data = JSON.parse(previousResultsJSON);
}

function handleUnload(event) {
  var resultsJSON = JSON.stringify(data);
  localStorage.setItem('results-list', resultsJSON);
}

window.addEventListener('beforeunload', handleUnload);
