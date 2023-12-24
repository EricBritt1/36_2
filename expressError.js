/** ExpressError extends the normal JS error so we can easily
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */

class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    console.error(this.stack);
  }
}

// I ran into trouble with using exclusively ExpressError. 
/* I struggled finding the error on my own so I referred to chatGPT 

Here was the error: 

**** As you can see two of the same error messages were being printed ****

{
	"error": {
		"message": [
			"instance requires property \"language\"",
			"instance requires property \"pages\"",
			"instance requires property \"title\"",
			"instance requires property \"year\""
		],
		"status": 400
	},
	"message": [
		"instance requires property \"language\"",
		"instance requires property \"pages\"",
		"instance requires property \"title\"",
		"instance requires property \"year\""
	]
}

chatGPT actually wasn't too helpful for this one. I had two options. For the original problem listed above ^^^ I got rid of the error by simply removing message: err.message from the general error handling on app.js. Message was being



*/




module.exports = ExpressError;