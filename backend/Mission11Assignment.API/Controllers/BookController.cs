using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11Assignment.API.Data;

namespace Mission11Assignment.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(
            int pageSize = 10,
            int pageNum = 1,
            [FromQuery] List<string>? bookCategories = null)
        {
            var query = _bookContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            var totalNumBooks = query.Count();

            var someBooks = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var someObject = new
            {
                Books = someBooks,
                TotalNumBooks = totalNumBooks
            };

            return Ok(someObject);
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);
            if (existingBook == null)
            {
                return NotFound(new { Message = $"Book with ID {bookId} not found." });
            }

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();
            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);
            if (book == null)
            {
                return NotFound(new { Message = $"Book with ID {bookId} not found." });
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();
            return NoContent();
        }
    }
}
