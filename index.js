'use strict'

const youtubeApiKey = 'AIzaSyAFe_P5hJr88I8OS3HbmX_jsTF91XrNpl4'
const youtubeUrl = 'https://www.googleapis.com/youtube/v3/search'
const gbifUrl = 'https://api.gbif.org/v1/species/search'

function queryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//add parameters to url and fetch data from GBIF API
function getSpecies(searchTerm) {
  const speciesParams = {
    q: searchTerm
  };
  const queryList = queryParams(speciesParams)
  const speciesUrl = gbifUrl + '?' + queryList;

  fetch(speciesUrl)
    .then(response => {
      return response.json();
    })
    .then(responseJson => {
      showSearchResults(responseJson);
    })
    .catch(err => {
      $('#errorMessage').text(`Something went wrong: ${err.message}`);
      console.log(err);
    });
}

//add parameters to url and fetch data from YouTube API
function getVideos(searchTerm) {
  const params = {
    key: 'AIzaSyAFe_P5hJr88I8OS3HbmX_jsTF91XrNpl4',
    part: "snippet",
    chart: "mostPopular",
    q: searchTerm,
    type: "video",
  };
  const queryString = queryParams(params)
  const url = youtubeUrl + '?' + queryString;

  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(responseJson => {
      showVideoResults(responseJson);
    })
    .catch(err => {
      $('#errorMessage').text(`Something went wrong: ${err.message}`);
    });
}

//display search results from GBIF API
function showSearchResults(responseJson) {
  $('#resultsList').empty();
  for (let i = 0; i < responseJson.results.length; i++) {
    $('#resultsList').append(
      `<li>
        <h2>${responseJson.results[i].species}</h2>
        <p>${responseJson.results[i].scientificName}</p>
        <p>${responseJson.results[i].kingdom}</p>
        <p>${responseJson.results[i].genus}</p>
      </li>`
    )
  };
  $('#resultsContainerInfo').removeClass('hidden');
}

//display search results from YouTube API
function showVideoResults(responseJson) {
  $('#videoList').empty();
  for (let i = 0; i < responseJson.items.length; i++) {
    $('#videoList').append(
      `<li>
      <p>${responseJson.items[i].snippet.title}</p>
      <a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target='_blank'>
        <img src='${responseJson.items[i].snippet.thumbnails.medium.url}' alt="animal video"/>
      </a>
     </li>`
    )
  };
  $('#resultsContainerVideo').removeClass('hidden');
};

//watch for submit and call functions
function watchForm() {
  $('#searchContainer').submit(event => {
    event.preventDefault();
    const searchTerm = $('#searchTerm').val();
    getVideos(searchTerm);
    getSpecies(searchTerm);
  });
}

$(watchForm);