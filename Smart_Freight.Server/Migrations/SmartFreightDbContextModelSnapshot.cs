using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Smart_Freight.Server.Data;

#nullable disable

namespace Smart_Freight.Server.Migrations;

[DbContext(typeof(SmartFreightDbContext))]
partial class SmartFreightDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.8")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
        {
            b.Property<string>("Id")
                .HasColumnType("nvarchar(450)");

            b.Property<string>("ConcurrencyStamp")
                .IsConcurrencyToken()
                .HasColumnType("nvarchar(max)");

            b.Property<string>("Name")
                .HasMaxLength(256)
                .HasColumnType("nvarchar(256)");

            b.Property<string>("NormalizedName")
                .HasMaxLength(256)
                .HasColumnType("nvarchar(256)");

            b.HasKey("Id");

            b.HasIndex("NormalizedName")
                .IsUnique()
                .HasDatabaseName("RoleNameIndex")
                .HasFilter("[NormalizedName] IS NOT NULL");

            b.ToTable("AspNetRoles");
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasAnnotation("SqlServer:Identity", "1, 1");

            b.Property<string>("ClaimType")
                .HasColumnType("nvarchar(max)");

            b.Property<string>("ClaimValue")
                .HasColumnType("nvarchar(max)");

            b.Property<string>("RoleId")
                .IsRequired()
                .HasColumnType("nvarchar(450)");

            b.HasKey("Id");

            b.HasIndex("RoleId");

            b.ToTable("AspNetRoleClaims");
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasAnnotation("SqlServer:Identity", "1, 1");

            b.Property<string>("ClaimType")
                .HasColumnType("nvarchar(max)");

            b.Property<string>("ClaimValue")
                .HasColumnType("nvarchar(max)");

            b.Property<string>("UserId")
                .IsRequired()
                .HasColumnType("nvarchar(450)");

            b.HasKey("Id");

            b.HasIndex("UserId");

            b.ToTable("AspNetUserClaims");
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
        {
            b.Property<string>("LoginProvider")
                .HasColumnType("nvarchar(450)");

            b.Property<string>("ProviderKey")
                .HasColumnType("nvarchar(450)");

            b.Property<string>("ProviderDisplayName")
                .HasColumnType("nvarchar(max)");

            b.Property<string>("UserId")
                .IsRequired()
                .HasColumnType("nvarchar(450)");

            b.HasKey("LoginProvider", "ProviderKey");

            b.HasIndex("UserId");

            b.ToTable("AspNetUserLogins");
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
        {
            b.Property<string>("UserId")
                .HasColumnType("nvarchar(450)");

            b.Property<string>("RoleId")
                .HasColumnType("nvarchar(450)");

            b.HasKey("UserId", "RoleId");

            b.HasIndex("RoleId");

            b.ToTable("AspNetUserRoles");
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
        {
            b.Property<string>("UserId")
                .HasColumnType("nvarchar(450)");

            b.Property<string>("LoginProvider")
                .HasColumnType("nvarchar(450)");

            b.Property<string>("Name")
                .HasColumnType("nvarchar(450)");

            b.Property<string>("Value")
                .HasColumnType("nvarchar(max)");

            b.HasKey("UserId", "LoginProvider", "Name");

            b.ToTable("AspNetUserTokens");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.ApplicationUser", b =>
        {
            b.Property<string>("Id")
                .HasColumnType("nvarchar(450)");

            b.Property<int>("AccessFailedCount")
                .HasColumnType("int");

            b.Property<string>("ConcurrencyStamp")
                .IsConcurrencyToken()
                .HasColumnType("nvarchar(max)");

            b.Property<string>("Email")
                .HasMaxLength(256)
                .HasColumnType("nvarchar(256)");

            b.Property<bool>("EmailConfirmed")
                .HasColumnType("bit");

            b.Property<string>("FullName")
                .HasColumnType("nvarchar(max)");

            b.Property<bool>("IsActive")
                .HasColumnType("bit");

            b.Property<DateTimeOffset?>("LockoutEnd")
                .HasColumnType("datetimeoffset");

            b.Property<bool>("LockoutEnabled")
                .HasColumnType("bit");

            b.Property<string>("NormalizedEmail")
                .HasMaxLength(256)
                .HasColumnType("nvarchar(256)");

            b.Property<string>("NormalizedUserName")
                .HasMaxLength(256)
                .HasColumnType("nvarchar(256)");

            b.Property<string>("PasswordHash")
                .HasColumnType("nvarchar(max)");

            b.Property<string>("PhoneNumber")
                .HasColumnType("nvarchar(max)");

            b.Property<bool>("PhoneNumberConfirmed")
                .HasColumnType("bit");

            b.Property<string>("SecurityStamp")
                .HasColumnType("nvarchar(max)");

            b.Property<bool>("TwoFactorEnabled")
                .HasColumnType("bit");

            b.Property<string>("UserName")
                .HasMaxLength(256)
                .HasColumnType("nvarchar(256)");

            b.HasKey("Id");

            b.HasIndex("NormalizedEmail")
                .HasDatabaseName("EmailIndex");

            b.HasIndex("NormalizedUserName")
                .IsUnique()
                .HasDatabaseName("UserNameIndex")
                .HasFilter("[NormalizedUserName] IS NOT NULL");

            b.ToTable("AspNetUsers");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.Driver", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<DateTimeOffset>("CreatedAt")
                .HasColumnType("datetimeoffset");

            b.Property<string>("Email")
                .HasMaxLength(256)
                .HasColumnType("nvarchar(256)");

            b.Property<string>("FirstName")
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("nvarchar(100)");

            b.Property<bool>("IsActive")
                .HasColumnType("bit");

            b.Property<string>("LastName")
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("nvarchar(100)");

            b.Property<string>("LicenseNumber")
                .HasMaxLength(100)
                .HasColumnType("nvarchar(100)");

            b.Property<string>("PhoneNumber")
                .HasMaxLength(50)
                .HasColumnType("nvarchar(50)");

            b.Property<string>("UserId")
                .IsRequired()
                .HasColumnType("nvarchar(450)");

            b.Property<DateTimeOffset?>("UpdatedAt")
                .HasColumnType("datetimeoffset");

            b.HasKey("Id");

            b.HasIndex("UserId")
                .IsUnique();

            b.ToTable("Drivers");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.GraphEdge", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<Guid>("FromNodeId")
                .HasColumnType("uniqueidentifier");

            b.Property<bool>("IsBidirectional")
                .HasColumnType("bit");

            b.Property<Guid>("ToNodeId")
                .HasColumnType("uniqueidentifier");

            b.Property<decimal>("Weight")
                .HasPrecision(18, 2)
                .HasColumnType("decimal(18,2)");

            b.HasKey("Id");

            b.HasIndex("FromNodeId");

            b.HasIndex("ToNodeId");

            b.ToTable("GraphEdges");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.GraphNode", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<decimal?>("Latitude")
                .HasPrecision(9, 6)
                .HasColumnType("decimal(9,6)");

            b.Property<decimal?>("Longitude")
                .HasPrecision(9, 6)
                .HasColumnType("decimal(9,6)");

            b.Property<string>("Name")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)");

            b.HasKey("Id");

            b.ToTable("GraphNodes");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.Product", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<DateTimeOffset>("CreatedAt")
                .HasColumnType("datetimeoffset");

            b.Property<string>("Name")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)");

            b.Property<string>("Sku")
                .HasMaxLength(100)
                .HasColumnType("nvarchar(100)");

            b.Property<decimal>("UnitWeightKg")
                .HasPrecision(18, 2)
                .HasColumnType("decimal(18,2)");

            b.HasKey("Id");

            b.ToTable("Products");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.ProductStock", b =>
        {
            b.Property<Guid>("ProductId")
                .HasColumnType("uniqueidentifier");

            b.Property<int>("AvailableQuantity")
                .HasColumnType("int");

            b.Property<DateTimeOffset>("UpdatedAt")
                .HasColumnType("datetimeoffset");

            b.HasKey("ProductId");

            b.ToTable("ProductStocks");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.StopLocation", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<string>("AddressText")
                .HasMaxLength(300)
                .HasColumnType("nvarchar(300)");

            b.Property<DateTimeOffset>("CreatedAt")
                .HasColumnType("datetimeoffset");

            b.Property<Guid>("GraphNodeId")
                .HasColumnType("uniqueidentifier");

            b.Property<decimal?>("Latitude")
                .HasPrecision(9, 6)
                .HasColumnType("decimal(9,6)");

            b.Property<decimal?>("Longitude")
                .HasPrecision(9, 6)
                .HasColumnType("decimal(9,6)");

            b.Property<string>("Name")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)");

            b.HasKey("Id");

            b.HasIndex("GraphNodeId");

            b.ToTable("StopLocations");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.Trip", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<DateTimeOffset>("CreatedAt")
                .HasColumnType("datetimeoffset");

            b.Property<string>("CreatedByUserId")
                .IsRequired()
                .HasColumnType("nvarchar(450)");

            b.Property<Guid>("DriverId")
                .HasColumnType("uniqueidentifier");

            b.Property<decimal?>("TotalPlannedCostOrTime")
                .HasPrecision(18, 2)
                .HasColumnType("decimal(18,2)");

            b.Property<decimal>("TotalPlannedDistance")
                .HasPrecision(18, 2)
                .HasColumnType("decimal(18,2)");

            b.Property<int>("Status")
                .HasColumnType("int");

            b.Property<Guid>("TruckId")
                .HasColumnType("uniqueidentifier");

            b.HasKey("Id");

            b.HasIndex("CreatedByUserId");

            b.HasIndex("DriverId");

            b.HasIndex("TruckId");

            b.ToTable("Trips");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.TripCargoItem", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<Guid>("ProductId")
                .HasColumnType("uniqueidentifier");

            b.Property<int>("Quantity")
                .HasColumnType("int");

            b.Property<decimal>("TotalWeightKg")
                .HasPrecision(18, 2)
                .HasColumnType("decimal(18,2)");

            b.Property<Guid>("TripId")
                .HasColumnType("uniqueidentifier");

            b.HasKey("Id");

            b.HasIndex("ProductId");

            b.HasIndex("TripId");

            b.ToTable("TripCargoItems");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.TripRouteStep", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<decimal>("CumulativeWeight")
                .HasPrecision(18, 2)
                .HasColumnType("decimal(18,2)");

            b.Property<decimal>("EdgeWeight")
                .HasPrecision(18, 2)
                .HasColumnType("decimal(18,2)");

            b.Property<Guid>("FromNodeId")
                .HasColumnType("uniqueidentifier");

            b.Property<int>("StepOrder")
                .HasColumnType("int");

            b.Property<Guid>("ToNodeId")
                .HasColumnType("uniqueidentifier");

            b.Property<Guid>("TripId")
                .HasColumnType("uniqueidentifier");

            b.HasKey("Id");

            b.HasIndex("FromNodeId");

            b.HasIndex("ToNodeId");

            b.HasIndex("TripId");

            b.ToTable("TripRouteSteps");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.TripStop", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<DateTimeOffset?>("ActualArrivalTime")
                .HasColumnType("datetimeoffset");

            b.Property<string>("Notes")
                .HasColumnType("nvarchar(max)");

            b.Property<DateTimeOffset?>("PlannedArrivalTime")
                .HasColumnType("datetimeoffset");

            b.Property<Guid>("StopLocationId")
                .HasColumnType("uniqueidentifier");

            b.Property<int>("StopOrder")
                .HasColumnType("int");

            b.Property<int>("Status")
                .HasColumnType("int");

            b.Property<Guid>("TripId")
                .HasColumnType("uniqueidentifier");

            b.HasKey("Id");

            b.HasIndex("StopLocationId");

            b.HasIndex("TripId");

            b.ToTable("TripStops");
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.Truck", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uniqueidentifier");

            b.Property<DateTimeOffset>("CreatedAt")
                .HasColumnType("datetimeoffset");

            b.Property<bool>("IsActive")
                .HasColumnType("bit");

            b.Property<decimal>("MaxPayloadKg")
                .HasPrecision(18, 2)
                .HasColumnType("decimal(18,2)");

            b.Property<string>("Name")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)");

            b.Property<string>("PlateNumber")
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnType("nvarchar(50)");

            b.HasKey("Id");

            b.ToTable("Trucks");
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
        {
            b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                .WithMany()
                .HasForeignKey("RoleId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.ApplicationUser", null)
                .WithMany()
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.ApplicationUser", null)
                .WithMany()
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
        {
            b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                .WithMany()
                .HasForeignKey("RoleId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.HasOne("Smart_Freight.Server.Models.ApplicationUser", null)
                .WithMany()
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.ApplicationUser", null)
                .WithMany()
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.Driver", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.ApplicationUser", "User")
                .WithOne("Driver")
                .HasForeignKey("Smart_Freight.Server.Models.Driver", "UserId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.GraphEdge", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.GraphNode", "FromNode")
                .WithMany()
                .HasForeignKey("FromNodeId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.HasOne("Smart_Freight.Server.Models.GraphNode", "ToNode")
                .WithMany()
                .HasForeignKey("ToNodeId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.ProductStock", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.Product", "Product")
                .WithOne("Stock")
                .HasForeignKey("Smart_Freight.Server.Models.ProductStock", "ProductId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.StopLocation", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.GraphNode", "GraphNode")
                .WithMany()
                .HasForeignKey("GraphNodeId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.Trip", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.Driver", "Driver")
                .WithMany()
                .HasForeignKey("DriverId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.HasOne("Smart_Freight.Server.Models.ApplicationUser", "CreatedByUser")
                .WithMany()
                .HasForeignKey("CreatedByUserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.HasOne("Smart_Freight.Server.Models.Truck", "Truck")
                .WithMany()
                .HasForeignKey("TruckId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.TripCargoItem", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.Product", "Product")
                .WithMany()
                .HasForeignKey("ProductId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.HasOne("Smart_Freight.Server.Models.Trip", "Trip")
                .WithMany("CargoItems")
                .HasForeignKey("TripId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.TripRouteStep", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.GraphNode", "FromNode")
                .WithMany()
                .HasForeignKey("FromNodeId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.HasOne("Smart_Freight.Server.Models.GraphNode", "ToNode")
                .WithMany()
                .HasForeignKey("ToNodeId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.HasOne("Smart_Freight.Server.Models.Trip", "Trip")
                .WithMany("RouteSteps")
                .HasForeignKey("TripId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity("Smart_Freight.Server.Models.TripStop", b =>
        {
            b.HasOne("Smart_Freight.Server.Models.StopLocation", "StopLocation")
                .WithMany()
                .HasForeignKey("StopLocationId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.HasOne("Smart_Freight.Server.Models.Trip", "Trip")
                .WithMany("Stops")
                .HasForeignKey("TripId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });
    }
}
