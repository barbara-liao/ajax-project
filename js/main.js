var $searchForm = document.querySelector('#search-form');
var $ul = document.querySelector('ul');
var $searchResultTitle = document.querySelector('#update-result-search');
var $container = document.querySelectorAll('.container');
var $searchButton = document.querySelector('#search-button');
var $navSearchButton = document.querySelector('#nav-search-button');

$searchForm.addEventListener('submit', handleSubmit);
$searchButton.addEventListener('click', dataView);
$navSearchButton.addEventListener('click', dataView);
window.addEventListener('DOMContentLoaded', handleLoad);

function handleLoad(event) {
  for (var i = 0; i < data.results.length; i++) {
    var render = renderResults(data.results[i]);
    $ul.appendChild(render);
  }
  $searchResultTitle.textContent = 'Search Results for ' + '"' + data.search + '"';
  viewSwap(data.view);
}

function handleSubmit(event) {
  event.preventDefault();
  var keywords = [];
  var tempOutput = '';
  var $liList = document.querySelectorAll('li');

  for (var d = 0; d < $liList.length; d++) {
    $liList[d].remove();
  }

  data.results = [];

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
    for (var a = 0; a < this.response.items.length; a++) {
      data.results.push(this.response.items[a]);
      var render = renderResults(this.response.items[a]);
      $ul.appendChild(render);
    }
  });

  $searchResultTitle.textContent = 'Search Results for ' + '"' + $searchForm.elements.search.value + '"';
  data.search = $searchForm.elements.search.value;

  $searchForm.reset();
  newSearch.send();
}

function renderResults(result) {
  var $li = document.createElement('li');

  var $card = document.createElement('div');
  $li.appendChild($card);
  $card.className = 'row card';

  var $colOneThird = document.createElement('div');
  $card.appendChild($colOneThird);
  $colOneThird.className = 'column-one-third justify-center align-center';

  var $image = document.createElement('img');
  $colOneThird.appendChild($image);
  $image.className = 'image-width';
  if ('imageLinks' in result.volumeInfo) {
    $image.setAttribute('src', result.volumeInfo.imageLinks.thumbnail);
  } else {
    $image.setAttribute('src', 'images/placeholder-image-square.jpg');
  }

  var $colTwoThird = document.createElement('div');
  $card.appendChild($colTwoThird);
  $colTwoThird.className = 'column-two-thirds flex-column';

  var $rowAdd = document.createElement('div');
  $colTwoThird.appendChild($rowAdd);
  $rowAdd.className = 'row justify-end';

  var $plus = document.createElement('i');
  $rowAdd.appendChild($plus);
  $plus.className = 'fas fa-plus';

  var $rowTitle = document.createElement('div');
  $colTwoThird.appendChild($rowTitle);
  $rowTitle.className = 'row';

  var $title = document.createElement('h3');
  $rowTitle.appendChild($title);
  $title.className = 'result-title';
  $title.textContent = result.volumeInfo.title;

  var $rowAuthor = document.createElement('div');
  $colTwoThird.appendChild($rowAuthor);
  $rowAuthor.className = 'row flex-column';

  if ('authors' in result.volumeInfo) {
    for (var i = 0; i < result.volumeInfo.authors.length; i++) {
      var $author = document.createElement('p');
      $rowAuthor.appendChild($author);
      $author.className = 'result-author';
      $author.textContent = result.volumeInfo.authors[i];
    }
  }

  var $rowDetails = document.createElement('div');
  $colTwoThird.appendChild($rowDetails);
  $rowDetails.className = 'row margin-top-auto';

  var $detailButton = document.createElement('button');
  $rowDetails.appendChild($detailButton);
  $detailButton.textContent = 'Details';
  $detailButton.className = 'detail-button';
  $detailButton.setAttribute('data-view', 'detail-view');
  $detailButton.setAttribute('id', 'details');

  return $li;
}

function dataView(event) {
  var $dataView = event.target.getAttribute('data-view');

  if ($dataView !== '') {
    viewSwap($dataView);
  }
}

function viewSwap(string) {
  for (var i = 0; i < $container.length; i++) {
    if ($container[i].dataset.view === string) {
      $container[i].className = 'container';
      var currentView = $container[i].dataset.view;
      data.view = currentView;
    } else {
      $container[i].className = 'container hidden';
    }
  }
}
