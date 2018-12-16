$(document).ready(function(){
    $.get("/scrape", function(){
      console.log("scraping completed");
    }).then(function(){
      $.getJSON("api/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          $("#articles").append(`<a href='${data[i].link}'>${data[i].title}</a>
                                  <p>${data[i].teaser}</p>
                                  <button  data-id='${data[i]._id}' id="noteButton">Comment</button><br />`);
        }
      });
    })
  })
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "#noteButton", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "api/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Comment</button>");
  
        // If there's a note in the article
        if (data.note) {
          $("#notes").append(`<ul id="commentList"></ul>`);
  
          // Place the title of the note in the title input
          const notes = data.note;
          notes.forEach(note => {
            $("#commentList").append(`<li class="articleComment" data-id="${note._id}">${note.title}: ${note.body} </li>`);
          });
  
        }
      });
  });
  $(document).on("click", ".articleComment", function () {
    const thisId = $(this).attr("data-id");
    $("#savenote").attr("id", "updateNote");
    $.ajax({
      method: "GET",
      url: "/api/notes/" + thisId
    })
      .then(function(data) {
        $("#titleinput").val(data[0].title);
        $("#bodyinput").val(data[0].body);
      }).then(function(){
        $(document).on("click", "#updateNote", function(){
          $.ajax({
            method: "PUT",
            url: "/api/notes/" + thisId,
            data: {
              title: $("#titleinput").val(),
              // Value taken from note textarea
              body: $("#bodyinput").val()
            }
          })
          .then(function(data){
            console.log("updated");
            $("#notes").empty();
          });
        });
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    let thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "api/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  