using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Freight.Server.Migrations;

public partial class AddLogisticsModule : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "AspNetRoles",
            columns: table => new
            {
                Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table => { table.PrimaryKey("PK_AspNetRoles", x => x.Id); });

        migrationBuilder.CreateTable(
            name: "AspNetUsers",
            columns: table => new
            {
                Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                IsActive = table.Column<bool>(type: "bit", nullable: false),
                UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                AccessFailedCount = table.Column<int>(type: "int", nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_AspNetUsers", x => x.Id); });

        migrationBuilder.CreateTable(
            name: "Drivers",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                PhoneNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                LicenseNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                IsActive = table.Column<bool>(type: "bit", nullable: false),
                CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
            },
            constraints: table => { table.PrimaryKey("PK_Drivers", x => x.Id); });

        migrationBuilder.CreateTable(
            name: "GraphNodes",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                Latitude = table.Column<decimal>(type: "decimal(9,6)", nullable: true),
                Longitude = table.Column<decimal>(type: "decimal(9,6)", nullable: true)
            },
            constraints: table => { table.PrimaryKey("PK_GraphNodes", x => x.Id); });

        migrationBuilder.CreateTable(
            name: "Products",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                Sku = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                UnitWeightKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_Products", x => x.Id); });

        migrationBuilder.CreateTable(
            name: "Trucks",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                PlateNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                MaxPayloadKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                IsActive = table.Column<bool>(type: "bit", nullable: false),
                CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_Trucks", x => x.Id); });

        migrationBuilder.CreateTable(
            name: "AspNetRoleClaims",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                table.ForeignKey(
                    name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "AspNetRoles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserClaims",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                table.ForeignKey(
                    name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserLogins",
            columns: table => new
            {
                LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                table.ForeignKey(
                    name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserRoles",
            columns: table => new
            {
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                table.ForeignKey(
                    name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "AspNetRoles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserTokens",
            columns: table => new
            {
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                table.ForeignKey(
                    name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "ProductStocks",
            columns: table => new
            {
                ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                AvailableQuantity = table.Column<int>(type: "int", nullable: false),
                UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ProductStocks", x => x.ProductId);
                table.ForeignKey(
                    name: "FK_ProductStocks_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "StopLocations",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                AddressText = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                GraphNodeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Latitude = table.Column<decimal>(type: "decimal(9,6)", nullable: true),
                Longitude = table.Column<decimal>(type: "decimal(9,6)", nullable: true),
                CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_StopLocations", x => x.Id);
                table.ForeignKey(
                    name: "FK_StopLocations_GraphNodes_GraphNodeId",
                    column: x => x.GraphNodeId,
                    principalTable: "GraphNodes",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "GraphEdges",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                FromNodeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ToNodeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Weight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                IsBidirectional = table.Column<bool>(type: "bit", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_GraphEdges", x => x.Id);
                table.ForeignKey(
                    name: "FK_GraphEdges_GraphNodes_FromNodeId",
                    column: x => x.FromNodeId,
                    principalTable: "GraphNodes",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_GraphEdges_GraphNodes_ToNodeId",
                    column: x => x.ToNodeId,
                    principalTable: "GraphNodes",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateTable(
            name: "Trips",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                TruckId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Status = table.Column<int>(type: "int", nullable: false),
                TotalPlannedDistance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                TotalPlannedCostOrTime = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                CreatedByUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Trips", x => x.Id);
                table.ForeignKey(
                    name: "FK_Trips_AspNetUsers_CreatedByUserId",
                    column: x => x.CreatedByUserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_Trips_Trucks_TruckId",
                    column: x => x.TruckId,
                    principalTable: "Trucks",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "TripCargoItems",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                TripId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                Quantity = table.Column<int>(type: "int", nullable: false),
                TotalWeightKg = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_TripCargoItems", x => x.Id);
                table.ForeignKey(
                    name: "FK_TripCargoItems_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_TripCargoItems_Trips_TripId",
                    column: x => x.TripId,
                    principalTable: "Trips",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "TripRouteSteps",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                TripId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                StepOrder = table.Column<int>(type: "int", nullable: false),
                FromNodeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                ToNodeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                EdgeWeight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                CumulativeWeight = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_TripRouteSteps", x => x.Id);
                table.ForeignKey(
                    name: "FK_TripRouteSteps_GraphNodes_FromNodeId",
                    column: x => x.FromNodeId,
                    principalTable: "GraphNodes",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_TripRouteSteps_GraphNodes_ToNodeId",
                    column: x => x.ToNodeId,
                    principalTable: "GraphNodes",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_TripRouteSteps_Trips_TripId",
                    column: x => x.TripId,
                    principalTable: "Trips",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "TripStops",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                TripId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                StopLocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                StopOrder = table.Column<int>(type: "int", nullable: false),
                PlannedArrivalTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                ActualArrivalTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                Status = table.Column<int>(type: "int", nullable: false),
                Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_TripStops", x => x.Id);
                table.ForeignKey(
                    name: "FK_TripStops_StopLocations_StopLocationId",
                    column: x => x.StopLocationId,
                    principalTable: "StopLocations",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_TripStops_Trips_TripId",
                    column: x => x.TripId,
                    principalTable: "Trips",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_AspNetRoleClaims_RoleId",
            table: "AspNetRoleClaims",
            column: "RoleId");

        migrationBuilder.CreateIndex(
            name: "RoleNameIndex",
            table: "AspNetRoles",
            column: "NormalizedName",
            unique: true,
            filter: "[NormalizedName] IS NOT NULL");

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserClaims_UserId",
            table: "AspNetUserClaims",
            column: "UserId");

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserLogins_UserId",
            table: "AspNetUserLogins",
            column: "UserId");

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserRoles_RoleId",
            table: "AspNetUserRoles",
            column: "RoleId");

        migrationBuilder.CreateIndex(
            name: "EmailIndex",
            table: "AspNetUsers",
            column: "NormalizedEmail");

        migrationBuilder.CreateIndex(
            name: "UserNameIndex",
            table: "AspNetUsers",
            column: "NormalizedUserName",
            unique: true,
            filter: "[NormalizedUserName] IS NOT NULL");

        migrationBuilder.CreateIndex(
            name: "IX_GraphEdges_FromNodeId",
            table: "GraphEdges",
            column: "FromNodeId");

        migrationBuilder.CreateIndex(
            name: "IX_GraphEdges_ToNodeId",
            table: "GraphEdges",
            column: "ToNodeId");

        migrationBuilder.CreateIndex(
            name: "IX_StopLocations_GraphNodeId",
            table: "StopLocations",
            column: "GraphNodeId");

        migrationBuilder.CreateIndex(
            name: "IX_TripCargoItems_ProductId",
            table: "TripCargoItems",
            column: "ProductId");

        migrationBuilder.CreateIndex(
            name: "IX_TripCargoItems_TripId",
            table: "TripCargoItems",
            column: "TripId");

        migrationBuilder.CreateIndex(
            name: "IX_TripRouteSteps_FromNodeId",
            table: "TripRouteSteps",
            column: "FromNodeId");

        migrationBuilder.CreateIndex(
            name: "IX_TripRouteSteps_ToNodeId",
            table: "TripRouteSteps",
            column: "ToNodeId");

        migrationBuilder.CreateIndex(
            name: "IX_TripRouteSteps_TripId",
            table: "TripRouteSteps",
            column: "TripId");

        migrationBuilder.CreateIndex(
            name: "IX_Trips_CreatedByUserId",
            table: "Trips",
            column: "CreatedByUserId");

        migrationBuilder.CreateIndex(
            name: "IX_Trips_TruckId",
            table: "Trips",
            column: "TruckId");

        migrationBuilder.CreateIndex(
            name: "IX_TripStops_StopLocationId",
            table: "TripStops",
            column: "StopLocationId");

        migrationBuilder.CreateIndex(
            name: "IX_TripStops_TripId",
            table: "TripStops",
            column: "TripId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "AspNetRoleClaims");
        migrationBuilder.DropTable(name: "AspNetUserClaims");
        migrationBuilder.DropTable(name: "AspNetUserLogins");
        migrationBuilder.DropTable(name: "AspNetUserRoles");
        migrationBuilder.DropTable(name: "AspNetUserTokens");
        migrationBuilder.DropTable(name: "Drivers");
        migrationBuilder.DropTable(name: "GraphEdges");
        migrationBuilder.DropTable(name: "ProductStocks");
        migrationBuilder.DropTable(name: "TripCargoItems");
        migrationBuilder.DropTable(name: "TripRouteSteps");
        migrationBuilder.DropTable(name: "TripStops");
        migrationBuilder.DropTable(name: "AspNetRoles");
        migrationBuilder.DropTable(name: "Products");
        migrationBuilder.DropTable(name: "StopLocations");
        migrationBuilder.DropTable(name: "Trips");
        migrationBuilder.DropTable(name: "GraphNodes");
        migrationBuilder.DropTable(name: "Trucks");
        migrationBuilder.DropTable(name: "AspNetUsers");
    }
}
