using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11Assignment.API.Data;
using System.Linq;

namespace WaterProject.API.Controllers
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
            int pageSize = 5,
            int pageNum = 1,
            string? sortBy = null,
            string sortDir = "asc")
        {
            var query = _bookContext.Books.AsQueryable();

            if (!string.IsNullOrWhiteSpace(sortBy) && sortBy.ToLower() == "title")
            {
                query = sortDir.ToLower() == "desc"
                    ? query.OrderByDescending(b => b.Title)
                    : query.OrderBy(b => b.Title);
            }

            var totalNumBooks = query.Count();

            var pageOfBooks = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var someObject = new
            {
                Books = pageOfBooks,
                TotalNumBooks = totalNumBooks
            };

            return Ok(someObject);
        }
    }
}
