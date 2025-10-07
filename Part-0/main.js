var allNotes = [];
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText);
    allNotes = data;
    readrawNotes();
  }
};

function readrawNotes() {
  var notesContainer = document.getElementById("notesData");
  notesContainer.innerHTML = '';
  var ul = document.createElement('ul');
  ul.setAttribute('class', 'notesData');
  allNotes.forEach(function (note) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(note.content));
    ul.appendChild(li);
  });
  notesContainer.appendChild(ul);
}

document.addEventListener('DOMContentLoaded', function () {
  xhttp.open("GET", "/Part-0/data.json", true);
  xhttp.send();

  var form = document.getElementById('formData');
  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault();
      var note = {
        content: e.target.elements[0].value,
        date: new Date(),
      };
      allNotes.push(note);
      e.target.elements[0].value = '';
      readrawNotes();
    };
  } else {
    console.error("Element with ID 'formData' not found.");
  }
});
