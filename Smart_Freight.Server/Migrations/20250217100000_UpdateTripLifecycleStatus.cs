using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Freight.Server.Migrations;

public partial class UpdateTripLifecycleStatus : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<DateTimeOffset>(
            name: "DoneAt",
            table: "Trips",
            type: "datetimeoffset",
            nullable: true);

        migrationBuilder.Sql(
            """
            UPDATE Trips
            SET Status = CASE Status
                WHEN 0 THEN 0 -- Planned -> Waiting
                WHEN 1 THEN 1 -- InProgress -> Active
                WHEN 2 THEN 3 -- Completed -> Done
                WHEN 3 THEN 2 -- Cancelled -> Cancelled (new enum index)
                ELSE 0
            END;

            IF COL_LENGTH('Trips', 'IsActive') IS NOT NULL
            BEGIN
                UPDATE Trips
                SET Status = CASE WHEN IsActive = 1 THEN 1 ELSE 0 END
                WHERE Status IS NULL;
            END
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            UPDATE Trips
            SET Status = CASE Status
                WHEN 0 THEN 0 -- Waiting -> Planned
                WHEN 1 THEN 1 -- Active -> InProgress
                WHEN 2 THEN 3 -- Cancelled -> Cancelled (old enum index)
                WHEN 3 THEN 2 -- Done -> Completed
                ELSE 0
            END;
            """);

        migrationBuilder.DropColumn(
            name: "DoneAt",
            table: "Trips");
    }
}
