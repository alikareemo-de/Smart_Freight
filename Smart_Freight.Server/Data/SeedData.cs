using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Data;

public static class SeedData
{
    private static readonly string[] Roles =
    [
        "Admin",
        "Dispatcher",
        "Driver",
        "Customer"
    ];

    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<SmartFreightDbContext>();

        foreach (var role in Roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        var adminEmail = "admin@smartfreight.io";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser is null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FullName = "System Admin"
            };
            var result = await userManager.CreateAsync(adminUser, "Admin123$");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        await SeedLogisticsAsync(dbContext);
    }

    private static async Task SeedLogisticsAsync(SmartFreightDbContext dbContext)
    {
        if (!await dbContext.GraphNodes.AnyAsync())
        {
            var nodeA = new GraphNode { Id = Guid.NewGuid(), Name = "Depot A", Latitude = 40.7128m, Longitude = -74.0060m };
            var nodeB = new GraphNode { Id = Guid.NewGuid(), Name = "Cross Dock", Latitude = 40.7306m, Longitude = -73.9352m };
            var nodeC = new GraphNode { Id = Guid.NewGuid(), Name = "Uptown Hub", Latitude = 40.7580m, Longitude = -73.9855m };
            var nodeD = new GraphNode { Id = Guid.NewGuid(), Name = "East Warehouse", Latitude = 40.7614m, Longitude = -73.9776m };
            var nodeE = new GraphNode { Id = Guid.NewGuid(), Name = "South Point", Latitude = 40.7060m, Longitude = -74.0086m };
            var nodeF = new GraphNode { Id = Guid.NewGuid(), Name = "North Terminal", Latitude = 40.7851m, Longitude = -73.9683m };

            dbContext.GraphNodes.AddRange(nodeA, nodeB, nodeC, nodeD, nodeE, nodeF);

            dbContext.GraphEdges.AddRange(
                new GraphEdge { Id = Guid.NewGuid(), FromNodeId = nodeA.Id, ToNodeId = nodeB.Id, Weight = 4.2m, IsBidirectional = true },
                new GraphEdge { Id = Guid.NewGuid(), FromNodeId = nodeB.Id, ToNodeId = nodeC.Id, Weight = 3.1m, IsBidirectional = true },
                new GraphEdge { Id = Guid.NewGuid(), FromNodeId = nodeC.Id, ToNodeId = nodeD.Id, Weight = 1.4m, IsBidirectional = true },
                new GraphEdge { Id = Guid.NewGuid(), FromNodeId = nodeB.Id, ToNodeId = nodeE.Id, Weight = 2.8m, IsBidirectional = true },
                new GraphEdge { Id = Guid.NewGuid(), FromNodeId = nodeE.Id, ToNodeId = nodeA.Id, Weight = 2.5m, IsBidirectional = true },
                new GraphEdge { Id = Guid.NewGuid(), FromNodeId = nodeC.Id, ToNodeId = nodeF.Id, Weight = 3.6m, IsBidirectional = true }
            );

            dbContext.StopLocations.AddRange(
                new StopLocation { Id = Guid.NewGuid(), Name = "City Center Drop", AddressText = "100 Main St", GraphNodeId = nodeC.Id },
                new StopLocation { Id = Guid.NewGuid(), Name = "Market Street", AddressText = "200 Market Ave", GraphNodeId = nodeD.Id },
                new StopLocation { Id = Guid.NewGuid(), Name = "Harbor Delivery", AddressText = "300 Harbor Rd", GraphNodeId = nodeE.Id }
            );
        }

        if (!await dbContext.Trucks.AnyAsync())
        {
            dbContext.Trucks.AddRange(
                new Truck
                {
                    Id = Guid.NewGuid(),
                    Name = "Freightliner M2",
                    PlateNumber = "SF-1001",
                    MaxPayloadKg = 7500m,
                    IsActive = true
                },
                new Truck
                {
                    Id = Guid.NewGuid(),
                    Name = "Volvo VNL",
                    PlateNumber = "SF-2002",
                    MaxPayloadKg = 12000m,
                    IsActive = true
                }
            );
        }

        if (!await dbContext.Products.AnyAsync())
        {
            var pallets = new Product
            {
                Id = Guid.NewGuid(),
                Name = "Palletized Electronics",
                Sku = "ELEC-PA-01",
                UnitWeightKg = 120m
            };
            var beverages = new Product
            {
                Id = Guid.NewGuid(),
                Name = "Beverage Cases",
                Sku = "BEV-CASE-02",
                UnitWeightKg = 18m
            };
            var furniture = new Product
            {
                Id = Guid.NewGuid(),
                Name = "Flat-Pack Furniture",
                Sku = "FURN-FP-03",
                UnitWeightKg = 45m
            };

            dbContext.Products.AddRange(pallets, beverages, furniture);
            dbContext.ProductStocks.AddRange(
                new ProductStock { ProductId = pallets.Id, AvailableQuantity = 40, UpdatedAt = DateTimeOffset.UtcNow },
                new ProductStock { ProductId = beverages.Id, AvailableQuantity = 200, UpdatedAt = DateTimeOffset.UtcNow },
                new ProductStock { ProductId = furniture.Id, AvailableQuantity = 75, UpdatedAt = DateTimeOffset.UtcNow }
            );
        }

        await dbContext.SaveChangesAsync();
    }
}
