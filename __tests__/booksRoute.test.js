process.env.NODE_ENV = "test"

const request = require("supertest");

const app = require("../app");
const db = require("../db");

// I thought I'd need this since it's our model. How do you know what you need to include in test file and don't?  
const Book = require("../models/book");


let book_isbn;

beforeEach(async () => {
    let result = await db.query(`
  INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
  VALUES (
    '0691161518',
    'http://a.co/eobPtX2',
    'Matthew Lane',
    'english',
    264,
    'Princeton University Press',
    'Power-Up: Unlocking the Hidden Mathematics in Video Games',
    2017
  )
  RETURNING isbn
`);

    book_isbn = result.rows[0].isbn
})




describe('/GET /books', function() {
    test('Return all books', async function() {
        const response = await request(app).get('/books')
        const books = response.body.books
        expect(books).toHaveLength(1)
        expect(books[0]).toHaveProperty("amazon_url")
    })
})

describe('/GET /books/:id', function() {
    test('Return specific book using isbn as id parameter', async function () {
        const response = await request(app).get(`/books/${book_isbn}`)
        const SPECIFIC_BOOK = response.body.book
        expect(SPECIFIC_BOOK).toEqual({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          })
        expect(SPECIFIC_BOOK.isbn).toBe('0691161518')
        expect(SPECIFIC_BOOK.title).toBe("Power-Up: Unlocking the Hidden Mathematics in Video Games")
    })

    test('Invalid isbn', async function() {
        const response = await request(app).get('/books/2190381221');
        const expectedErrorMessage = `There is no book with an isbn '2190381221'`;
      
        expect(response.body.error).toEqual({ message: expectedErrorMessage, status: 404 });
      });
});


describe('/POST /books', function() {
    test('Create a book', async function() {
        const CREATE_BOOK = await request(app).post('/books').send({
            "isbn": "9324023432",
            "amazon_url": "http://a.co/eobPtX2koijoi",
            "author": "Nani Ka",
            "language": "japanese",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Naruto",
            "year": 2017
          })
    
    expect(CREATE_BOOK.statusCode).toBe(201);
    expect(CREATE_BOOK.body.book).toEqual({
        "isbn": "9324023432",
        "amazon_url": "http://a.co/eobPtX2koijoi",
        "author": "Nani Ka",
        "language": "japanese",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Naruto",
        "year": 2017
      })
    expect(CREATE_BOOK.body.book).toHaveProperty('year')
    })
})

//My put path is wrong. I spent quite a bit of time on this assignment and am on a time crunch. Will fix later. I tried using chatGPT but that failed. Perhaps somehing to do with my schema. My errors aren't even displaying when I check my log.
describe("PUT /books/:id", function () {
    test("Updates a single book", async function () {
      const response = await request(app)
          .put(`/books/${book_isbn}`)
          .send({
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            publisher: "yeah right",
            title: "UPDATED BOOK",
            year: 2000
          });
      expect(response.body.book).toHaveProperty("isbn");
      expect(response.body.book.title).toBe("UPDATED BOOK");
    });
})

describe("DELETE /books/isbn", function () {
    test("Delete specific book", async function() {
        const DELETE_BOOK = await request(app).delete(`/books/${book_isbn}`)
        expect(DELETE_BOOK.body).toEqual({ message: "Book deleted"});
    })
})




afterEach( async function () {
    await db.query(`DELETE FROM books`);
})


afterAll(async function () {
    await db.end()
})





