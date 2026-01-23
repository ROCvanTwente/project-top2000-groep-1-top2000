using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TemplateJwtProject.Migrations
{
    /// <inheritdoc />
    public partial class LarsTom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // WebsiteUrl column already added in previous migration (AddArtistDetails)
            // This migration is intentionally left empty
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Nothing to revert
        }
    }
}
