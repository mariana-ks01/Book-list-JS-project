// Book class: Represents a book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handles UI tasks
class UI {
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

        static addBookToList(book){
            const list = document.querySelector('#book-list');

            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class = "btn btn-danger btn-sm delete">X</a></td>
            `;

            list.appendChild(row);
        }

        static deleteBook(el){
            if(el.classList.contains('delete')){
                el.parentElement.parentElement.remove();
            }
        }

        static showAlert(message, className){
            const div = document.createElement('div');
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            const container = document.querySelector('.container');
            const form = document.querySelector('#book-form');
            container.insertBefore(div, form); //inserting the div before the form
            // Vanish in 3 seconds
            setTimeout(() => document.querySelector('.alert').remove(), 3000);
        }

        static clearFields(){
            document.querySelector('#title').value = '';
            document.querySelector('#author').value = '';
            document.querySelector('#isbn').value = '';
        }
    }


// Store class: Handles storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books')); // books are stored as a string in local storage, so we need to turn it into a JS array
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books)); //stringifying the array so it can be stored in local storage
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display books on page load
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
    // Instantiate book with the above values
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to Store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book added','success');

    // Clear input fields after submit
    UI.clearFields();
    }
});

// Event: Remove a book from UI
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    // Remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Book removed', 'success');
});