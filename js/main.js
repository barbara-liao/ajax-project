var $searchForm = document.querySelector('#search-form');
var $ul = document.querySelector('ul');
var $searchResultTitle = document.querySelector('#update-result-search');
var $container = document.querySelectorAll('.container');
var $searchButton = document.querySelector('#search-button');
var $navSearchButton = document.querySelector('#nav-search-button');
var $detailPageContainer = document.querySelector('#detail-page-container');
var $back = document.querySelector('#back-to-results');
var $modal = document.querySelector('.modal-overlay');
var $closeModal = document.querySelector('#close-modal');
var $bookmarkButtonNav = document.querySelector('#nav-bookmarks');
var $bookmarkButtonModal = document.querySelector('.go-to-bookmark');

$searchForm.addEventListener('submit', handleSubmit);
$searchButton.addEventListener('click', dataView);
$navSearchButton.addEventListener('click', dataView);
window.addEventListener('DOMContentLoaded', handleLoad);
$ul.addEventListener('click', handleDetail);
$ul.addEventListener('click', handleAdd);
$back.addEventListener('click', dataView);
$closeModal.addEventListener('click', closeModal);
$bookmarkButtonNav.addEventListener('click', handleBookmarks);
$bookmarkButtonModal.addEventListener('click', handleBookmarks);

function handleLoad(event) {
  viewSwap(data.view);

  if (data.searchPageView === 'Bookmarks') {
    for (var b = 0; b < data.bookmarks.length; b++) {
      var renderBookmarks = renderResults(data.bookmarks[b]);
      $ul.appendChild(renderBookmarks);
    }
    $searchResultTitle.textContent = 'Bookmarks';
  } else {
    for (var i = 0; i < data.results.length; i++) {
      var render = renderResults(data.results[i]);
      $ul.appendChild(render);
    }
    $searchResultTitle.textContent = 'Search Results for ' + '"' + data.search + '"';
  }

  var renderPreviousDetail = renderDetail(data.detail);
  $detailPageContainer.appendChild(renderPreviousDetail);
}

function handleSubmit(event) {
  event.preventDefault();
  var keywords = [];
  var tempOutput = '';

  var $liList = document.querySelectorAll('li');

  for (var d = 0; d < $liList.length; d++) {
    $liList[d].remove();
  }

  data.nextResultId = 0;
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
      data.nextResultId++;
    }
  });

  $searchResultTitle.textContent = 'Search Results for ' + '"' + $searchForm.elements.search.value + '"';
  data.search = $searchForm.elements.search.value;

  data.searchPageView = 'Search Results';
  $searchForm.reset();
  newSearch.send();
}

function renderResults(result) {
  var $li = document.createElement('li');
  $li.setAttribute('result-id', data.nextResultId);

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

  var $addBookmarkButton = document.createElement('button');
  $rowAdd.appendChild($addBookmarkButton);
  $addBookmarkButton.className = 'card-bookmark-button';

  var $plus = document.createElement('i');
  $addBookmarkButton.appendChild($plus);
  if (data.bookmarks.length === 0) {
    $plus.className = 'fas fa-plus margin-zero';
  } else {
    for (var b = 0; b < data.bookmarks.length; b++) {
      if (result.id === data.bookmarks[b].id) {
        $plus.className = 'fas fa-minus margin-zero';
        break;
      } else {
        $plus.className = 'fas fa-plus margin-zero';
      }
    }
  }
  $plus.classList.add('add-to-bookmarks');
  $plus.setAttribute('result-id', data.nextResultId);

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
  $detailButton.setAttribute('data-view', 'detail-page');
  $detailButton.setAttribute('id', 'details');
  $detailButton.setAttribute('result-id', data.nextResultId);

  return $li;
}

function renderDetail(result) {
  var $detailPageRender = document.createElement('div');
  $detailPageRender.setAttribute('id', 'detail-page-render');

  var $titleRow = document.createElement('div');
  $detailPageRender.appendChild($titleRow);
  $titleRow.className = 'row results-margin';

  var $title = document.createElement('h1');
  $titleRow.appendChild($title);
  $title.textContent = result.volumeInfo.title;

  var $detailRow = document.createElement('div');
  $detailPageRender.appendChild($detailRow);
  $detailRow.className = 'row detail-margin';

  var $colOneThird = document.createElement('div');
  $detailRow.appendChild($colOneThird);
  $colOneThird.className = 'column-one-third column-height flex justify-center align-center';

  var $image = document.createElement('img');
  $colOneThird.appendChild($image);
  $image.className = 'image-width';
  if ('imageLinks' in result.volumeInfo) {
    $image.setAttribute('src', result.volumeInfo.imageLinks.thumbnail);
  } else {
    $image.setAttribute('src', 'images/placeholder-image-square.jpg');
  }

  var $colTwoThird = document.createElement('div');
  $detailRow.appendChild($colTwoThird);
  $colTwoThird.className = 'column-two-thirds flex-column';

  var $genreRow = document.createElement('div');
  $colTwoThird.appendChild($genreRow);
  $genreRow.className = 'row genre-margin';

  var $genre = document.createElement('p');
  $genreRow.appendChild($genre);
  $genre.className = 'margin-zero genre-color';
  if ('categories' in result.volumeInfo) {
    $genre.textContent = result.volumeInfo.categories[0];
  }

  var $authorRow = document.createElement('div');
  $colTwoThird.appendChild($authorRow);
  $authorRow.className = 'row flex-column';

  if ('authors' in result.volumeInfo) {
    for (var i = 0; i < result.volumeInfo.authors.length; i++) {
      var $author = document.createElement('p');
      $authorRow.appendChild($author);
      $author.className = 'margin-zero';
      $author.textContent = result.volumeInfo.authors[i];
    }
  }

  var $starReviewBookmarkRow = document.createElement('div');
  $colTwoThird.appendChild($starReviewBookmarkRow);
  $starReviewBookmarkRow.className = 'margin-top-auto';

  var $ratings = document.createElement('div');
  $starReviewBookmarkRow.appendChild($ratings);
  $ratings.className = 'row star-size';

  for (var r = 0; r < result.volumeInfo.averageRating; r++) {
    var $filledStar = document.createElement('i');
    $filledStar.className = 'margin-zero fas fa-star';
    $ratings.appendChild($filledStar);
  }

  for (var f = 0; f < 5 - result.volumeInfo.averageRating; f++) {
    var $emptyStar = document.createElement('i');
    $emptyStar.className = 'margin-zero far fa-star';
    $ratings.appendChild($emptyStar);
  }

  var $reviewsRow = document.createElement('div');
  $starReviewBookmarkRow.appendChild($reviewsRow);
  $reviewsRow.className = 'row';

  var $reviews = document.createElement('p');
  $reviewsRow.appendChild($reviews);
  $reviews.className = 'reviews';
  if ('ratingsCount' in result.volumeInfo) {
    $reviews.textContent = result.volumeInfo.ratingsCount + ' Reviews';
  }

  var $buttonRow = document.createElement('div');
  $starReviewBookmarkRow.appendChild($buttonRow);
  $buttonRow.className = 'row';

  var $button = document.createElement('button');
  $buttonRow.appendChild($button);
  $button.className = 'bookmark-button';
  $button.textContent = 'Remove from Bookmarks';

  var $summaryRow = document.createElement('div');
  $detailPageRender.appendChild($summaryRow);
  $summaryRow.className = 'row detail-margin summary-size';

  var $summary = document.createElement('p');
  $summaryRow.appendChild($summary);
  $summary.textContent = result.volumeInfo.description;

  return $detailPageRender;
}

function handleDetail(event) {
  var $dataView = event.target.getAttribute('data-view');
  if (event.target.nodeName === 'BUTTON' && $dataView !== '') {
    var $previousRender = document.querySelectorAll('#detail-page-render');

    for (var d = 0; d < $previousRender.length; d++) {
      $previousRender[d].remove();
    }
    viewSwap($dataView);
  }

  var $resultId = event.target.getAttribute('result-id');

  var render = renderDetail(data.results[$resultId]);
  $detailPageContainer.appendChild(render);
  data.detail = data.results[$resultId];

}

function handleAdd(event) {
  var $class = event.target.getAttribute('class');
  if (event.target.className === 'fas fa-plus margin-zero add-to-bookmarks' && $class.includes('add-to-bookmarks')) {
    var $resultId = event.target.getAttribute('result-id');

    $modal.className = 'modal-overlay';
    event.target.className = 'fas fa-minus margin-zero';

    data.bookmarks.push(data.results[$resultId]);
  }
}

function closeModal(event) {
  var $id = event.target.getAttribute('id');
  if (event.target.nodeName === 'I' && $id === 'close-modal') {
    $modal.className = 'modal-overlay hidden';
  }
}

function handleBookmarks(event) {
  $modal.className = 'modal-overlay hidden';
  viewSwap('search-results');
  $searchResultTitle.textContent = 'Bookmarks';

  var $liList = document.querySelectorAll('li');

  for (var i = 0; i < $liList.length; i++) {
    $liList[i].remove();
  }

  for (var b = 0; b < data.bookmarks.length; b++) {
    var render = renderResults(data.bookmarks[b]);
    $ul.appendChild(render);
  }

  data.nextResultId = 0;
  viewSwap('search-results');
  data.searchPageView = 'Bookmarks';
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
