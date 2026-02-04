using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Freight.Server.Migrations;

public partial class UpdateTripDriverDeleteBehavior : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Trips_Drivers_DriverId",
            table: "Trips");

        migrationBuilder.AddForeignKey(
            name: "FK_Trips_Drivers_DriverId",
            table: "Trips",
            column: "DriverId",
            principalTable: "Drivers",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Trips_Drivers_DriverId",
            table: "Trips");

        migrationBuilder.AddForeignKey(
            name: "FK_Trips_Drivers_DriverId",
            table: "Trips",
            column: "DriverId",
            principalTable: "Drivers",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    }
}
