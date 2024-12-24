namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using MONATE.Web.Server.Data.Packets.WorkflowInfo;
    using MONATE.Web.Server.Logics;

    [ApiController]
    [Route("[controller]")]
    public class ValueTypeController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public ValueTypeController(MonateDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var _valueTypes = new List<ValueTypeData>();
            if (_context.ValueTypes != null)
            {
                var valueTypes = _context.ValueTypes.ToList();
                for (int i = 0; i < valueTypes.Count; i++)
                {
                    _valueTypes.Add(new ValueTypeData
                    {
                        Id = valueTypes[i].Id,
                        Name = valueTypes[i].Type.ToString(),
                        Description = valueTypes[i].Description ?? "",
                    });
                }
            }
            return Ok(new { valueTypes = _valueTypes });
        }
    }
}