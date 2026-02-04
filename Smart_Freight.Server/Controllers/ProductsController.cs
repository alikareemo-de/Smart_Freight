using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Dtos.Products;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Roles = "Admin,Dispatcher")]
public class ProductsController : ControllerBase
{
    private readonly SmartFreightDbContext _dbContext;

    public ProductsController(SmartFreightDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await _dbContext.Products
            .Include(product => product.Stock)
            .AsNoTracking()
            .OrderBy(product => product.Name)
            .Select(product => new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Sku = product.Sku,
                UnitWeightKg = product.UnitWeightKg,
                AvailableQuantity = product.Stock?.AvailableQuantity ?? 0,
                CreatedAt = product.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> CreateProduct(
        ProductCreateRequest request,
        CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Sku = request.Sku,
            UnitWeightKg = request.UnitWeightKg,
            CreatedAt = DateTimeOffset.UtcNow
        };

        var stock = new ProductStock
        {
            ProductId = product.Id,
            AvailableQuantity = 0,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Products.Add(product);
        _dbContext.ProductStocks.Add(stock);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            UnitWeightKg = product.UnitWeightKg,
            AvailableQuantity = stock.AvailableQuantity,
            CreatedAt = product.CreatedAt
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductResponse>> GetProduct(Guid id, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products
            .Include(item => item.Stock)
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            UnitWeightKg = product.UnitWeightKg,
            AvailableQuantity = product.Stock?.AvailableQuantity ?? 0,
            CreatedAt = product.CreatedAt
        });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductResponse>> UpdateProduct(
        Guid id,
        ProductUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products
            .Include(item => item.Stock)
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (product is null)
        {
            return NotFound();
        }

        product.Name = request.Name;
        product.Sku = request.Sku;
        product.UnitWeightKg = request.UnitWeightKg;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            UnitWeightKg = product.UnitWeightKg,
            AvailableQuantity = product.Stock?.AvailableQuantity ?? 0,
            CreatedAt = product.CreatedAt
        });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (product is null)
        {
            return NotFound();
        }

        var stock = await _dbContext.ProductStocks.FirstOrDefaultAsync(item => item.ProductId == id, cancellationToken);
        if (stock is not null)
        {
            _dbContext.ProductStocks.Remove(stock);
        }

        _dbContext.Products.Remove(product);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:guid}/stock")]
    public async Task<ActionResult<StockResponse>> GetStock(Guid id, CancellationToken cancellationToken)
    {
        var stock = await _dbContext.ProductStocks.AsNoTracking().FirstOrDefaultAsync(item => item.ProductId == id, cancellationToken);
        if (stock is null)
        {
            return NotFound();
        }

        return Ok(new StockResponse
        {
            ProductId = stock.ProductId,
            AvailableQuantity = stock.AvailableQuantity,
            UpdatedAt = stock.UpdatedAt
        });
    }

    [HttpPost("{id:guid}/stock/adjust")]
    public async Task<ActionResult<StockResponse>> AdjustStock(
        Guid id,
        StockAdjustRequest request,
        CancellationToken cancellationToken)
    {
        var stock = await _dbContext.ProductStocks.FirstOrDefaultAsync(item => item.ProductId == id, cancellationToken);
        if (stock is null)
        {
            return NotFound();
        }

        var updated = stock.AvailableQuantity + request.QuantityChange;
        if (updated < 0)
        {
            return BadRequest(new { message = "Stock cannot be negative." });
        }

        stock.AvailableQuantity = updated;
        stock.UpdatedAt = DateTimeOffset.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new StockResponse
        {
            ProductId = stock.ProductId,
            AvailableQuantity = stock.AvailableQuantity,
            UpdatedAt = stock.UpdatedAt
        });
    }
}
