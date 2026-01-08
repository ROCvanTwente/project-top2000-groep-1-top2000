using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TemplateJwtProject.Constants;
using TemplateJwtProject.Data;

namespace TemplateJwtProject.Services;

public static class RoleInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roleNames = { Roles.Admin, Roles.User };

        foreach (var roleName in roleNames) 
        {
            var roleExist = await roleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }
}

