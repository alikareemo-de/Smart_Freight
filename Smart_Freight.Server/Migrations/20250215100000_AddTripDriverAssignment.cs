using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Freight.Server.Migrations;

public partial class AddTripDriverAssignment : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<Guid>(
            name: "DriverId",
            table: "Trips",
            type: "uniqueidentifier",
            nullable: true);

        migrationBuilder.Sql("""
            DECLARE @driverId uniqueidentifier;
            SELECT TOP 1 @driverId = Id FROM Drivers;
            IF @driverId IS NULL
            BEGIN
                SET @driverId = NEWID();
                INSERT INTO Drivers (Id, FirstName, LastName, Email, PhoneNumber, LicenseNumber, IsActive, CreatedAt, UpdatedAt)
                VALUES (@driverId, 'System', 'Driver', NULL, NULL, NULL, 1, SYSUTCDATETIME(), NULL);
            END
            UPDATE Trips SET DriverId = @driverId WHERE DriverId IS NULL;
        """);

        migrationBuilder.AlterColumn<Guid>(
            name: "DriverId",
            table: "Trips",
            type: "uniqueidentifier",
            nullable: false,
            oldClrType: typeof(Guid),
            oldType: "uniqueidentifier",
            oldNullable: true);

        migrationBuilder.CreateIndex(
            name: "IX_Trips_DriverId",
            table: "Trips",
            column: "DriverId");

        migrationBuilder.AddForeignKey(
            name: "FK_Trips_Drivers_DriverId",
            table: "Trips",
            column: "DriverId",
            principalTable: "Drivers",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Trips_Drivers_DriverId",
            table: "Trips");

        migrationBuilder.DropIndex(
            name: "IX_Trips_DriverId",
            table: "Trips");

        migrationBuilder.DropColumn(
            name: "DriverId",
            table: "Trips");
    }
}
