namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using MONATE.Web.Server.Data.Packets.CategoryInfo;
    using MONATE.Web.Server.Logics;

    [ApiController]
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public CategoryController(MonateDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var _categories = new List<CategoryData>();
            if (_context.Categories != null)
            {
                var categories = _context.Categories.ToList();
                for (int i = 0; i < categories.Count; i++)
                {
                    _categories.Add(new CategoryData
                    {
                        Id = categories[i].Id,
                        Name = categories[i].Name,
                    });
                }
            }
            return Ok(new { categories = _categories });
        }
    }
}
