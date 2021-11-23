(function() {
    const app = new SimpleNoteApp().listen();
})();

// Function to handle the creation, editing, and deletion of notes
function SimpleNoteApp() {
    const self = this;
    self.noteText = document.querySelector('#note-text');
    self.noteColor = document.querySelector('#note-color');
    self.note = document.querySelector('.note-container');

    // Initialise notes to be empty with no currently selected note
    self.notes = [];
    self.selectedNote = null;
    
    // Function to listen for submission of a note
    self.listen = () => {
        // Set Observable to listen for form submissions
        const insertForm = document.querySelector('#add-note');
        const sourceForm = Rx.Observable.fromEvent(insertForm, 'submit');

        // Subscribing the observable to respond to submission of the form
        sourceForm.subscribe( event => {
            event.preventDefault();
            self.createNote(self.noteText.value, self.noteColor.value);
        });

        return self;
    }

    // Function to create a note 
    self.createNote = (noteText, color) => {
        // If the note is a new note, create and initialise a note
        if(self.selectedNote === null) {
            const note = new Note(noteText, color);

            // initialise the note with text, color, and edit and remove buttons
            note.setup();

            // Set Observable to listen for X to be clicked
            const deleteNote = note.removeButton;
            const deleteNoteSource = Rx.Observable.fromEvent(deleteNote, 'click');

            // Subscribing the observable to respond to delete button clicked
            deleteNoteSource.subscribe(() => {
                self.deleteNote(note);
            });

            // Set Observable to listen for Edit to be clicked
            const editNote = note.editButton;
            const editNoteSource = Rx.Observable.fromEvent(editNote, 'click');

            // Subscribing the observable to respond to Edit button clicked
            editNoteSource.subscribe(() => {
                self.editNote(note);
            })

            self.note.appendChild(note.htmlElement);
            self.notes.push(note);
        } else {
            // Note is an exisitng note
            // Change text and color to newly selected values
            self.selectedNote.setText(noteText);
            self.selectedNote.setColor(color);
        }

        // Reset textarea and optional select values to be empty
        self.noteColor.value = "";
        self.noteText.value = "";
        self.selectedNote = null;
    }
    
    // Function to handle when an edit note button is clicked
    self.editNote = (note) => {
        self.selectedNote = note;
        self.noteColor.value = note.color;
        self.noteText.value = note.text;
    }
    
    // Function to handle when a remove note button is clicked
    self.deleteNote = (note) => {
        // Find the note to be deleted
        const found = self.notes.findIndex((noteToDelete) => { 
            return note === noteToDelete;
        });

        // If the note is found, then delete it
        if(found > -1) {
            // remove note from the notes array and remove the notes markup
            self.notes.splice(found, 0);
            self.note.removeChild(note.htmlElement);
        }
    }
}

// function that models a note
function Note(text, color) {
    const self = this;
    self.text = text;
    self.color = color;
    self.htmlElement = null;
    self.removeButton = null;
    self.editButton = null;
    self.content = null;
    
    // function to initialise a notes values
    self.setup = () => {
        self.htmlElement = document.createElement('div');
        self.content = document.createElement('p');
        self.removeButton = document.createElement('button');
        self.removeButton.className = 'delete';
        self.removeButton.innerHTML = 'Remove'
        self.editButton = document.createElement('button');
        self.editButton.className = 'edit-button'
        self.editButton.innerHTML = 'Edit';
        self.setColor(self.color);
        self.setText(self.text);
        self.htmlElement.appendChild(self.content);
        self.htmlElement.appendChild(self.removeButton);
        self.htmlElement.appendChild(self.editButton);
    }
    
    // function that controls the color of a note
    self.setColor = (color) => {
        self.htmlElement.className = 'note-instance';
        self.htmlElement.classList.add(color);
        self.color = color;
    }  
    
    // function that controls the text of a note
    self.setText = (text) => {
        self.content.textContent = text;
        self.text = text;
    }
}