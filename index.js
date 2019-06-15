'use strict'

const youtubeApiKey = 'AIzaSyAFe_P5hJr88I8OS3HbmX_jsTF91XrNpl4'
const youtubeUrl = 'https://www.googleapis.com/youtube/v3/search'
const gbifUrl = 'https://api.gbif.org/v1/species/search'

function queryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getSpecies(searchTerm) {
  const speciesParams = {
    q: searchTerm,
    facet: "type"
  };
  const queryList = queryParams(speciesParams)
  const speciesUrl = gbifUrl + '?' + queryList;

  fetch(speciesUrl)
    .then(response => {
      return response.json();
      console.log(responseJson);
    })
    .then(responseJson => {
      showSearchResults(responseJson);
    })
    .catch(err => {
      $('#errorMessage').text(`Something went wrong: ${err.message}`);
      console.log(err);
    });
}

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
  console.log(url);

  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(responseJson => {
      showVideoResults(responseJson);
    })
    .catch(err => {
      $('#errorMessage').text(`Something went wrong: ${err.message}`);
      console.log(err);
    });
}

function showSearchResults(responseJson) {
  $('#resultsList').empty();
  for (let i = 0; i < responseJson.results.length; i++) {
    $('#resultsList').append(
      `<li>
        <h2>${responseJson.results[i].species}</h2>
        <p>${responseJson.results[i].scientificName}</p>
      </li>`
    )
  };
  $('#resultsContainerInfo').removeClass('hidden');
}

function showVideoResults(responseJson) {
  console.log(responseJson);
  $('#videoList').empty();
  for (let i = 0; i < responseJson.items.length; i++) {
    $('#videoList').append(
      `<li>
      <p>${responseJson.items[i].snippet.title}</p>
      <a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target='_blank'>
        <img src='${responseJson.items[i].snippet.thumbnails.medium.url}'/>
      </a>
     </li>`
    )
  };
  $('#resultsContainerVideo').removeClass('hidden');
};

function watchForm() {
  $('#searchContainer').submit(event => {
    event.preventDefault();
    const searchTerm = $('#searchTerm').val();
    getVideos(searchTerm);
    getSpecies(searchTerm);
  });
}

$(watchForm);