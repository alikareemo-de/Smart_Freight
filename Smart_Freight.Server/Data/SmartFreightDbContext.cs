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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Driver>(entity =>
        {
            entity.HasKey(driver => driver.Id);
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
        });
    }
}
