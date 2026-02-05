using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Data;

public class SmartFreightDbContext : IdentityDbContext<ApplicationUser>
{
    public SmartFreightDbContext(DbContextOptions<SmartFreightDbContext> options)
        : base(options)
    {
    }

    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Truck> Trucks => Set<Truck>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductStock> ProductStocks => Set<ProductStock>();
    public DbSet<StopLocation> StopLocations => Set<StopLocation>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripStop> TripStops => Set<TripStop>();
    public DbSet<TripCargoItem> TripCargoItems => Set<TripCargoItem>();
    public DbSet<GraphNode> GraphNodes => Set<GraphNode>();
    public DbSet<GraphEdge> GraphEdges => Set<GraphEdge>();
    public DbSet<TripRouteStep> TripRouteSteps => Set<TripRouteStep>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Driver>(entity =>
        {
            entity.HasKey(driver => driver.Id);
            entity.Property(driver => driver.UserId)
                .IsRequired();
            entity.Property(driver => driver.FirstName)
                .HasMaxLength(100)
                .IsRequired();
            entity.Property(driver => driver.LastName)
                .HasMaxLength(100)
                .IsRequired();
            entity.Property(driver => driver.Email)
                .HasMaxLength(256);
            entity.Property(driver => driver.PhoneNumber)
                .HasMaxLength(50);
            entity.Property(driver => driver.LicenseNumber)
                .HasMaxLength(100);
            entity.HasIndex(driver => driver.UserId)
                .IsUnique();
            entity.HasOne(driver => driver.User)
                .WithOne(user => user.Driver)
                .HasForeignKey<Driver>(driver => driver.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Truck>(entity =>
        {
            entity.HasKey(truck => truck.Id);
            entity.Property(truck => truck.Name)
                .HasMaxLength(200)
                .IsRequired();
            entity.Property(truck => truck.PlateNumber)
                .HasMaxLength(50)
                .IsRequired();
            entity.Property(truck => truck.MaxPayloadKg)
                .HasPrecision(18, 2);
        });

        builder.Entity<Product>(entity =>
        {
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Name)
                .HasMaxLength(200)
                .IsRequired();
            entity.Property(product => product.Sku)
                .HasMaxLength(100);
            entity.Property(product => product.UnitWeightKg)
                .HasPrecision(18, 2);
        });

        builder.Entity<ProductStock>(entity =>
        {
            entity.HasKey(stock => stock.ProductId);
            entity.HasOne(stock => stock.Product)
                .WithOne(product => product.Stock)
                .HasForeignKey<ProductStock>(stock => stock.ProductId);
        });

        builder.Entity<StopLocation>(entity =>
        {
            entity.HasKey(location => location.Id);
            entity.Property(location => location.Name)
                .HasMaxLength(200)
                .IsRequired();
            entity.Property(location => location.AddressText)
                .HasMaxLength(300);
            entity.Property(location => location.Latitude)
                .HasPrecision(9, 6);
            entity.Property(location => location.Longitude)
                .HasPrecision(9, 6);
        });

        builder.Entity<Trip>(entity =>
        {
            entity.HasKey(trip => trip.Id);
            entity.Property(trip => trip.DriverId)
                .IsRequired();
            entity.Property(trip => trip.TotalPlannedDistance)
                .HasPrecision(18, 2);
            entity.Property(trip => trip.TotalPlannedCostOrTime)
                .HasPrecision(18, 2);
            entity.HasOne(trip => trip.Truck)
                .WithMany()
                .HasForeignKey(trip => trip.TruckId);
            entity.HasOne(trip => trip.Driver)
                .WithMany()
                .HasForeignKey(trip => trip.DriverId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(trip => trip.CreatedByUser)
                .WithMany()
                .HasForeignKey(trip => trip.CreatedByUserId);
        });

        builder.Entity<TripStop>(entity =>
        {
            entity.HasKey(stop => stop.Id);
            entity.HasOne(stop => stop.Trip)
                .WithMany(trip => trip.Stops)
                .HasForeignKey(stop => stop.TripId);
            entity.HasOne(stop => stop.StopLocation)
                .WithMany()
                .HasForeignKey(stop => stop.StopLocationId);
        });

        builder.Entity<TripCargoItem>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.Property(item => item.TotalWeightKg)
                .HasPrecision(18, 2);
            entity.HasOne(item => item.Trip)
                .WithMany(trip => trip.CargoItems)
                .HasForeignKey(item => item.TripId);
            entity.HasOne(item => item.Product)
                .WithMany()
                .HasForeignKey(item => item.ProductId);
        });

        builder.Entity<GraphNode>(entity =>
        {
            entity.HasKey(node => node.Id);
            entity.Property(node => node.Name)
                .HasMaxLength(200)
                .IsRequired();
            entity.Property(node => node.Latitude)
                .HasPrecision(9, 6);
            entity.Property(node => node.Longitude)
                .HasPrecision(9, 6);
        });

        builder.Entity<GraphEdge>(entity =>
        {
            entity.HasKey(edge => edge.Id);
            entity.Property(edge => edge.Weight)
                .HasPrecision(18, 2);
            entity.HasOne(edge => edge.FromNode)
                .WithMany()
                .HasForeignKey(edge => edge.FromNodeId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(edge => edge.ToNode)
                .WithMany()
                .HasForeignKey(edge => edge.ToNodeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<TripRouteStep>(entity =>
        {
            entity.HasKey(step => step.Id);
            entity.Property(step => step.EdgeWeight)
                .HasPrecision(18, 2);
            entity.Property(step => step.CumulativeWeight)
                .HasPrecision(18, 2);
            entity.HasOne(step => step.Trip)
                .WithMany(trip => trip.RouteSteps)
                .HasForeignKey(step => step.TripId);
            entity.HasOne(step => step.FromNode)
                .WithMany()
                .HasForeignKey(step => step.FromNodeId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(step => step.ToNode)
                .WithMany()
                .HasForeignKey(step => step.ToNodeId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
