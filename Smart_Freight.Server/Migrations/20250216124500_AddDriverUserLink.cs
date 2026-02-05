using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Freight.Server.Migrations;

public partial class AddDriverUserLink : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "UserId",
            table: "Drivers",
            type: "nvarchar(450)",
            nullable: true);

        migrationBuilder.Sql(
            """
            DECLARE @DriverUsers TABLE (
                DriverId uniqueidentifier,
                UserId nvarchar(450),
                UserName nvarchar(256),
                NormalizedUserName nvarchar(256),
                Email nvarchar(256),
                NormalizedEmail nvarchar(256),
                PhoneNumber nvarchar(max),
                FullName nvarchar(max),
                IsActive bit
            );

            INSERT INTO @DriverUsers (DriverId, UserId, UserName, NormalizedUserName, Email, NormalizedEmail, PhoneNumber, FullName, IsActive)
            SELECT
                d.Id,
                CAST(NEWID() AS nvarchar(450)),
                COALESCE(d.Email, CONCAT('driver-', d.Id, '@example.invalid')),
                UPPER(COALESCE(d.Email, CONCAT('driver-', d.Id, '@example.invalid'))),
                d.Email,
                CASE WHEN d.Email IS NULL THEN NULL ELSE UPPER(d.Email) END,
                d.PhoneNumber,
                LTRIM(RTRIM(CONCAT(d.FirstName, ' ', d.LastName))),
                d.IsActive
            FROM Drivers d
            WHERE d.UserId IS NULL;

            INSERT INTO AspNetUsers (
                Id,
                UserName,
                NormalizedUserName,
                Email,
                NormalizedEmail,
                EmailConfirmed,
                PhoneNumber,
                PhoneNumberConfirmed,
                IsActive,
                FullName,
                SecurityStamp,
                ConcurrencyStamp,
                TwoFactorEnabled,
                LockoutEnabled,
                AccessFailedCount
            )
            SELECT
                UserId,
                UserName,
                NormalizedUserName,
                Email,
                NormalizedEmail,
                CASE WHEN Email IS NULL THEN 0 ELSE 1 END,
                PhoneNumber,
                0,
                IsActive,
                FullName,
                NEWID(),
                NEWID(),
                0,
                0,
                0
            FROM @DriverUsers;

            UPDATE d
            SET d.UserId = du.UserId
            FROM Drivers d
            INNER JOIN @DriverUsers du ON d.Id = du.DriverId;
            """);

        migrationBuilder.Sql(
            """
            IF EXISTS (
                SELECT 1
                FROM Trips t
                LEFT JOIN Drivers d ON t.DriverId = d.Id
                WHERE d.Id IS NULL
            )
            BEGIN
                DECLARE @fallbackDriverId uniqueidentifier;
                SELECT TOP 1 @fallbackDriverId = Id FROM Drivers;
                IF @fallbackDriverId IS NOT NULL
                BEGIN
                    UPDATE Trips
                    SET DriverId = @fallbackDriverId
                    WHERE DriverId NOT IN (SELECT Id FROM Drivers);
                END
            END
            """);

        migrationBuilder.AlterColumn<string>(
            name: "UserId",
            table: "Drivers",
            type: "nvarchar(450)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(450)",
            oldNullable: true);

        migrationBuilder.CreateIndex(
            name: "IX_Drivers_UserId",
            table: "Drivers",
            column: "UserId",
            unique: true);

        migrationBuilder.AddForeignKey(
            name: "FK_Drivers_AspNetUsers_UserId",
            table: "Drivers",
            column: "UserId",
            principalTable: "AspNetUsers",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Drivers_AspNetUsers_UserId",
            table: "Drivers");

        migrationBuilder.DropIndex(
            name: "IX_Drivers_UserId",
            table: "Drivers");

        migrationBuilder.DropColumn(
            name: "UserId",
            table: "Drivers");
    }
}
