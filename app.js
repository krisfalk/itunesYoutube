var keyword = new searchedWord();
document.getElementById('viewTable').style.display = 'none';
function searchedWord(name){
  this.newName = name;
}
function checkSearchType(){
    document.getElementById('viewTable').style.display = '';
    keyWordsearch();
    performSearch();
}
function urlEncode(obj) {
  var save = '';
  for (var key in obj) {
    save += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
  }
  if (save.length > 0) {
    save = save.substr(0, save.length - 1);
  }

  return (save);
}

function performSearch() {
  keyword.newName = encodeURIComponent($('#search-keyword').val());
  var params = {
    term: keyword.newName,
    country: 'US',
    media: 'music',
    entity: 'musicTrack',
    limit: 40,
    callback: 'handleTunesSearchResults'
  };
  var params = urlEncode(params);
  var url = 'http://itunes.apple.com/search?' + params;
  var html = '<script src="' + url + '"><\/script>';
  $('head').append(html);
  clearTextbox();
}

function clearTextbox(){
  document.getElementById('search-keyword').value='';
}

function handleTunesSearchResults(arg) {
  var results = arg.results;
  var html = '';
  for (var i = 0; i < results.length; i++) {
    var item = results[i];
    var obj = {
      source: 0,
      track_id: item.trackId,
      track_name: item.trackCensoredName,
      track_url: item.trackViewUrl,
      artist_name: item.artistName,
      artist_url: item.artistViewUrl,
      collection_name: item.collectionCensoredName,
      genre: item.primaryGenreName,
      artwork: item.artworkUrl100
    };
    results[i] = obj;

    html += '<div class="songs-search-result" style="text-align:left">';
    html += '<img id="imgArt" src="{0}">'.replace("{0}", obj.artwork);
    html += '<span class="label">Preview:</span><audio src="{0}" preload="none" controls></audio><br />'.replace("{0}", item.previewUrl);
    html += '<span class="label">Track:</span>{0}&nbsp;&nbsp;  '.replace("{0}", obj.track_name);
    html += '<a href="{0}" target="_blank">Full Song</a>&nbsp;&nbsp;<br />'.replace("{0}", obj.track_url);
    html += '<span class="label">Track Price:</span>{0} {1}<br />'.replace("{0}", item.trackPrice).replace("{1}", item.currency);
    html += '<span class="label">Artist:</span><a href="{0}" target="_blank">{1}</a><br />'.replace("{0}", obj.artist_url).replace("{1}", obj.artist_name);
    html += '<span class="label">Collection:</span><a href="{0}" target="_blank">{1}</a><br />'.replace("{0}", obj.collection_url).replace("{1}", obj.collection_name);
    html += '<span class="label">Primary Genre:</span>{0}<br />'.replace("{0}", obj.genre);

    html += '</div>';
  }
  $('#display-search').html('<h3>Your Results for \'{0}\':</h3>'.replace("{0}", keyword.newName));
  $("#itunes-results").html(html);
  $('#itunes-results').easyPaginate({
      paginateElement: 'div',
      elementsPerPage: 4,
      effect: 'climb'
  });
}

//$(document).ready(function()
//{

//$(".search_input").keyup(function()
//{

function keyWordsearch(){
var search_input = encodeURIComponent($('#search-keyword').val());
var keyword= encodeURIComponent(search_input);
var youtUrl='https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=4&order=relevance&q='+keyword+'&key=AIzaSyAxgmw-32PjjWqQHtVAES58YuGnW__BPpQ';

$.ajax
({
type: "GET",
url: youtUrl,
dataType:"jsonp",
success: function(response)
{
var final = '';
var myArray = response.items;
for (var i = 0; i < myArray.length; i++) {

var video_id = myArray[i].id.videoId;
var video_title = myArray[i].snippet.title;
var video_thumbnail_url = myArray[i].snippet.thumbnails.default.url;
var video_link='<a href={0} target="_blank">Watch On YouTube</a>&nbsp;&nbsp;<br />'.replace("{0}", 'https://www.youtube.com/watch?v=' + video_id);

final += "<div id='title'>";
final += video_title;
final += "<br />"
final += video_link;
final += "<br /><img src='{0}'>".replace("{0}", video_thumbnail_url);
final += "</div>";
}
$("#result").html(final);
$('#result').easyPaginate({
    paginateElement: 'div',
    elementsPerPage: 4,
    effect: 'climb'
});
}});
}
