  // Step 1: Detect user key up
  var timer;
  
  // Call API when user finishes typing > 500ms to prevent excessive calling
  var timeout = 500;
  
  $('#searchbox').keyup(function(){
      clearTimeout(timer);
      var keyword = $('#searchbox').val();
      if (keyword) {
          timer = setTimeout(function(){
            callAPI(keyword)
          }, timeout);
      }
  });
  
  // Step 2: Call API
  function callAPI(keyword){
    var movie = [];
    var series = [];

    // remove uncessasry spaces and join words with plus sign
    var s = keyword.trim().split(' ').join('+');
  
    const apikey = '7e8695d3';
    // Get movies
    $.ajax({
      type: "GET",
      url: 'http://www.omdbapi.com',
      data: {
        apikey,
        s,
        type: 'movie'
      },
    }).done(function (data) {
        if(data.Response == 'True'){
            movie = data.Search;
        }

         // Get TV shows
         $.ajax({
            type: "GET",
            url: 'http://www.omdbapi.com',
            data: {
              apikey,
              s,
              type: 'series'
            },
        }).done(function (data) {
            if(data.Response == 'True'){
                series = data.Search;
            }
           
            // Show result box
            var resultBox = $('.hidden');
            resultBox.removeClass('hidden');
            resultBox.addClass('show');

            // Call function to render results
            renderResult('movie', movie, keyword);
            renderResult('series', series, keyword);

        }).fail(function (error) {
            console.log(error)
        });

    }).fail(function (error) {
      console.log(error)
    });
  }
  
// Step 3: Render results in suggestion box
function renderResult (type, data, keyword){
    var html = '';
    if(data.length > 0){
        for(var i = 0; i < ( data.length > 3 ? 3 : data.length) ; i++){
            var title = data[i].Title;
            // Highlight the matched words
            var reg = new RegExp(keyword, 'gi');
            title = title.replace(reg, function(match) {return '<strong>' + match + '</strong>'});
            html += `<li><a href="#" class="block hover:bg-gray-200 rounded px-2 py-1">${title}</li>`
        }
    }else{
        html = '<li><span class="px-2">No result</span></li>'
    }
    $(`.${type}`).html(html);
}
