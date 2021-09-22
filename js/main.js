var $searchForm = document.querySelector('#search-form');

$searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  var keywords = [];
  var tempOutput = '';

  for (var i = 0; i < $searchForm.elements.search.value.length; i++) {
    if ($searchForm.elements.search.value[i] === ' ') {
      keywords.push(tempOutput);
      tempOutput = '';
    } else {
      tempOutput += $searchForm.elements.search.value[i];
    }
  }
  keywords.push(tempOutput);

  var urlSearch = 'https://www.googleapis.com/books/v1/volumes?q=';
  for (var k = 0; k < keywords.length; k++) {
    urlSearch += '+' + keywords[k];
  }

  urlSearch += '&key=AIzaSyAprbajqaJzqpx5B2mWefJBeXh5zfnaX9g';
  var newSearch = new XMLHttpRequest();
  newSearch.open('GET', urlSearch);
  newSearch.responseType = 'json';
  newSearch.addEventListener('load', function () {

  });

  $searchForm.reset();
  newSearch.send();
}
