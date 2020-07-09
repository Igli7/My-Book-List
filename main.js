// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn, date, description) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.date = date
        this.description = description;
    }
}

//UI Class: Handles UI Tasks

class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book => UI.addBookToList(book)));
    }

    static addBookToList(book) {
        const list = document.querySelector('.book-list');

        const addBook = document.createElement('div');
        addBook.className = 'book';

        addBook.innerHTML = `
        <div class="profile-box">
        <h2 class="searchable" >${book.title}</h2>

        <div class="author">
            <h3>Author:
                <span class="authorName">${book.author}</span>
            </h3>
        </div>

        <div class="isbn">
            <h3>ISBN#:
                <span class="isbnName">${book.isbn}</span>
            </h3>
        </div>

        <div class="date">
            <h3>Date:</h3>
            <p class="addDate">${book.date}</p>
        </div>

        <div class="description">
            <h3>Description</h3>
            <p class="addDescription"> ${book.description}</p>
        </div>

        <a class="remove" >x</a>
    </div> 
        
        `
        list.appendChild(addBook);

    }

    static deleteBook(el) {
        
        if (el.classList.contains('remove')) {

            const isbn = el.previousElementSibling.previousElementSibling.previousElementSibling.children[0].children[0].textContent;
            console.log(isbn);
            
            el.classList='remove question';
            el.innerHTML = `<div class="wrap"><div class="mark"></div></div>`;

            el.addEventListener('click', function(){
                if (el.classList.contains('question')) {
                    document.querySelector('.question').setAttribute(`data-isbn`, `${isbn}`);
                    el.parentElement.parentElement.remove();
                }
            })

        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.form');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //vanish in 3s
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#date').value = '';
        document.querySelector('#description').value = '';
    }
}

//Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn == isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


//Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Event: Add a Book

document.querySelector('#bookForm').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    const date = document.querySelector('#date').value;
    const description = document.querySelector('#description').value;


    //validate
    if(title === '' || author === '' || isbn === '' || date === '' || description === ''){

    }else{
        //Instatiate Book

    const book = new Book(title, author, isbn, date, description);

    //Add book to list
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book);

    //show success message
    UI.showAlert('*Book Added', 'added');



    //Clear Fields 
    UI.clearFields();
    }

    //Instatiate Book






});


//Remove a Book

document.querySelector('.book-list').addEventListener('click', (e) => {

    // Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from storage
    Store.removeBook( e.target.dataset.isbn );

    // Show remove message

})








// UI Design

//  Date 

let date = document.getElementById('date');

function checkValue(str, max) {
    if (str.charAt(0) !== '0' || str == '00') {
        let num = parseInt(str);
        if (isNaN(num) || num <= 0 || num > max) num = 1;
        str = num > parseInt(max.toString().charAt(0))
            && num.toString().length == 1 ? '0' + num : num.toString();
    };
    return str;
};



date.addEventListener('input', function (e) {
    this.type = 'text';
    let input = this.value;
    if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);
    let values = input.split('/').map(function (v) {
        return v.replace(/\D/g, '')
    });
    if (values[0]) values[0] = checkValue(values[0], 12);
    if (values[1]) values[1] = checkValue(values[1], 31);
    let output = values.map(function (v, i) {
        return v.length == 2 && i < 2 ? v + ' / ' : v;
    });
    this.value = output.join('').substr(0, 14);
});

//  ISBN

//Restricts input
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup",
        "select", "contextmenu", "drop"].forEach(function (event) {
            textbox.addEventListener(event, function () {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    this.value = "";
                }
            });
        });
}

//Install input filter
//ISBN
setInputFilter(document.getElementById('isbn'), function (value) {
    return /^\d*$/.test(value);
});




// Search Bar UI Design
const searchForm = document.querySelector('#search');
const searchInput = document.querySelector('.searchInput');
const searchIcon = document.querySelector('.fa-search');

searchIcon.addEventListener('click', function(){
    searchForm.className = "active";
    searchIcon.classList = 'fa fa-search active';
    searchInput.style.display = 'block';
})




searchInput.addEventListener('focus', function(){
    searchForm.className = "active";
    searchIcon.classList = 'fa fa-search active';
    searchInput.style.display = 'block';
});

searchInput.addEventListener('blur', function(){
    if(searchInput.value.length == 0){
        searchForm.classList = "";
    }else{
        searchForm.className = "active";
    searchIcon.classList = 'fa fa-search active';
    searchInput.style.display = 'block';
    }
});

//Search Bar funcionality

searchInput.addEventListener('keyup', filterNames);

function filterNames(){
    //Get value of input
    let filterValue = document.querySelector('.searchInput').value.toUpperCase();

    //Get Names
    let book = document.querySelector('.book-list');
    let names = book.querySelectorAll('.searchable');

    //Loop through elements w/ searchable class
    for(let i =0; i<names.length; i++){
        let text = names[i];
        console.log(text.parentElement);
        if(text.innerHTML.toUpperCase().indexOf(filterValue) > -1){
            names[i].parentElement.style.display = '';
        }else{
            names[i].parentElement.style.display = 'none';
        }
    }
}
