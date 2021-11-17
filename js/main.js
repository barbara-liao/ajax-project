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
var $confirmMessage = document.querySelector('.confirm-message');
var $bookmarkMessage = document.querySelector('.bookmark-message');

$searchForm.addEventListener('submit', handleSubmit);
$searchButton.addEventListener('click', dataView);
$navSearchButton.addEventListener('click', dataView);
window.addEventListener('DOMContentLoaded', handleLoad);
$ul.addEventListener('click', handleDetail);
$ul.addEventListener('click', handleAddAndRemove);
$back.addEventListener('click', dataView);
$closeModal.addEventListener('click', closeModal);
$bookmarkButtonNav.addEventListener('click', handleBookmarks);
$bookmarkButtonModal.addEventListener('click', handleBookmarks);
$bookmarkButtonModal.addEventListener('click', confirmRemove);
$detailPageContainer.addEventListener('click', handleAddAndRemove);

function handleLoad(event) {
  if (data.view === '') {
    viewSwap('search-page');
  } else {
    viewSwap(data.view);
  }

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
  noBookmarksMessage();

  if (data.detail !== null) {
    var renderPreviousDetail = renderDetail(data.detail);
    $detailPageContainer.appendChild(renderPreviousDetail);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  var keywords = [];
  var tempOutput = '';

  $bookmarkMessage.className = 'row justify-center align-center bookmark-message hidden';

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

  urlSearch += '&key=AIzaSyBjkEweaUC43xQh7FC2aazTwBLoAaPSiHY';
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

  data.searchPageView = 'Search Results';
  $searchForm.reset();
  newSearch.send();
}

function renderResults(result) {
  var $li = document.createElement('li');
  $li.setAttribute('data-id', result.id);

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
  $plus.setAttribute('data-id', result.id);

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
  $detailButton.setAttribute('data-id', result.id);

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
  $image.className = 'image-width-detail';
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

  for (var r = 0; r < Math.floor(result.volumeInfo.averageRating); r++) {
    var $filledStar = document.createElement('i');
    $filledStar.className = 'margin-zero fas fa-star';
    $ratings.appendChild($filledStar);
  }

  for (var f = 0; f < 5 - Math.floor(result.volumeInfo.averageRating); f++) {
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
  $button.className = 'detail-bookmark-button';
  if (data.bookmarks.length === 0) {
    $button.textContent = 'Add to Bookmarks';
  } else {
    for (var b = 0; b < data.bookmarks.length; b++) {
      if (result.id === data.bookmarks[b].id) {
        $button.textContent = 'Remove from Bookmarks';
        break;
      } else {
        $button.textContent = 'Add to Bookmarks';
      }
    }
  }

  var $horizontalLine = document.createElement('hr');
  $detailPageRender.appendChild($horizontalLine);
  $horizontalLine.className = 'line';

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

  var $resultId = event.target.getAttribute('data-id');

  if (data.searchPageView === 'Bookmarks') {
    for (var b = 0; b < data.bookmarks.length; b++) {
      if (data.bookmarks[b].id === $resultId) {
        var renderBookmarks = renderDetail(data.bookmarks[b]);
        $detailPageContainer.appendChild(renderBookmarks);
        data.detail = data.bookmarks[b];
      }
    }
  } else {
    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].id === $resultId) {
        var render = renderDetail(data.results[i]);
        $detailPageContainer.appendChild(render);
        data.detail = data.results[i];
      }
    }
  }
}

function handleAddAndRemove(event) {
  var $dataId = event.target.getAttribute('data-id');
  var $iList = document.querySelectorAll('i');
  if ((event.target.nodeName === 'BUTTON' && event.target.textContent === 'Add to Bookmarks') || event.target.className === 'fas fa-plus margin-zero') {
    $confirmMessage.textContent = 'Added to Bookmarks';
    $bookmarkButtonModal.textContent = 'Go to Bookmarks';
    $modal.className = 'modal-overlay';
    for (var b = 0; b < $iList.length; b++) {
      if (data.view === 'detail-page' && $iList[b].getAttribute('data-id') === data.detail.id) {
        $iList[b].className = 'fas fa-minus margin-zero';
      }
    }
    if (event.target.className === 'fas fa-plus margin-zero') {
      event.target.className = 'fas fa-minus margin-zero';
    }
    if (event.target.textContent === 'Add to Bookmarks') {
      event.target.textContent = 'Remove from Bookmarks';
    }
    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].id === $dataId || data.results[i].id === data.detail.id) {
        data.bookmarks.push(data.results[i]);
      }
    }
  } else if ((event.target.nodeName === 'BUTTON' && event.target.textContent === 'Remove from Bookmarks') || event.target.className === 'fas fa-minus margin-zero') {
    $modal.className = 'modal-overlay';
    $confirmMessage.textContent = 'Remove from Bookmarks?';
    $bookmarkButtonModal.textContent = 'Remove';
    data.removeId = $dataId;
  }
}

function confirmRemove(event) {
  var $bookmarkButton = document.querySelector('.detail-bookmark-button');
  if (event.target.textContent === 'Remove') {
    for (var i = 0; i < data.bookmarks.length; i++) {
      if (data.bookmarks[i].id === data.detail.id) {
        data.bookmarks.splice(i, 1);
        var $liList = document.querySelectorAll('li');
        $liList[i].remove();
      }
    }
    var $iList = document.querySelectorAll('i');
    for (var d = 0; d < $iList.length; d++) {
      if (data.view === 'detail-page' && $iList[d].getAttribute('data-id') === data.detail.id && $iList[d].className === 'fas fa-minus margin-zero') {
        $iList[d].className = 'fas fa-plus margin-zero';
      } else if (data.view === 'search-results' && $iList[d].getAttribute('data-id') === data.removeId) {
        $iList[d].className = 'fas fa-plus margin-zero';
      }
    }
  }
  $modal.className = 'modal-overlay hidden';
  $bookmarkButton.textContent = 'Add to Bookmarks';
  noBookmarksMessage();
}

function closeModal(event) {
  var $id = event.target.getAttribute('id');
  if (event.target.nodeName === 'I' && $id === 'close-modal') {
    $modal.className = 'modal-overlay hidden';
  }
}

function handleBookmarks(event) {
  var $navButton = event.target.getAttribute('class');
  var $liList = document.querySelectorAll('li');
  $modal.className = 'modal-overlay hidden';
  if (event.target.textContent === 'Go to Bookmarks' || $navButton === 'fas fa-book-open') {
    viewSwap('search-results');
    $searchResultTitle.textContent = 'Bookmarks';

    for (var i = 0; i < $liList.length; i++) {
      $liList[i].remove();
    }

    for (var b = 0; b < data.bookmarks.length; b++) {
      var render = renderResults(data.bookmarks[b]);
      $ul.appendChild(render);
    }

    data.searchPageView = 'Bookmarks';
  }
  noBookmarksMessage();
}

function noBookmarksMessage() {
  if (data.bookmarks.length === 0 && $searchResultTitle.textContent === 'Bookmarks') {
    $bookmarkMessage.className = 'row justify-center align-center bookmark-message';
  } else {
    $bookmarkMessage.className = 'row justify-center align-center bookmark-message hidden';
  }
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
