const express = require("express");
const ExpressError =require("../expressError")
const router = new express.Router();

const jsonschema = require("jsonschema")
const bookSchema = require("../schemas/bookSchemas.json")

const Book = require("../models/book");



/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const bookValidity = jsonschema.validate(req.body, bookSchema);

    if(!bookValidity.valid) {
      console.log(bookValidity)
      // The example in video slides use this. This doesn't work though????
      let listOfErrors = bookValidity.errors.map(e => e.stack);
      const err = new ExpressError(listOfErrors, 400);
      return next(err)
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    // Assuming bookValidity is defined somewhere in your code
    if (!bookValidity.valid) {
      console.log(bookValidity);
      let listOfErrors = bookValidity.errors.map((e) => e.stack);
      const err = new ExpressError(listOfErrors, 400);
      return next(err);
    }

    const book = await Book.update(req.params.isbn, req.body);

    if (!book) {
      // Handle the case where the book is not found
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
