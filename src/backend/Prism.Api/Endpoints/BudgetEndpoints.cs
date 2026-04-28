using Prism.Application.DTOs;
using Prism.Application.Services;

namespace Prism.Api.Endpoints;

/// <summary>
/// Maps Budget CRUD endpoints to the API.
/// </summary>
public static class BudgetEndpoints
{
    private const string TempUserId = "dev-user-001";

    public static RouteGroupBuilder MapBudgetEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAll);
        group.MapGet("/{id}", GetById);
        group.MapPost("/", Create);
        group.MapDelete("/{id}", Delete);

        return group;
    }

    private static async Task<IResult> GetAll(
        BudgetService service,
        int? year,
        int? month)
    {
        var budgets = await service.GetByUserIdAsync(TempUserId, year, month);
        return Results.Ok(budgets);
    }

    private static async Task<IResult> GetById(BudgetService service, string id)
    {
        var budget = await service.GetByIdAsync(TempUserId, id);
        return budget is null ? Results.NotFound() : Results.Ok(budget);
    }

    private static async Task<IResult> Create(BudgetService service, CreateBudgetRequest request)
    {
        var budget = await service.CreateAsync(TempUserId, request);
        return Results.Created($"/api/budgets/{budget.Id}", budget);
    }

    private static async Task<IResult> Delete(BudgetService service, string id)
    {
        var deleted = await service.DeleteAsync(TempUserId, id);
        return deleted ? Results.NoContent() : Results.NotFound();
    }
}
