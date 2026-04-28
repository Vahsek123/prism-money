using Prism.Application.DTOs;
using Prism.Application.Services;

namespace Prism.Api.Endpoints;

/// <summary>
/// Maps Holding (portfolio) CRUD endpoints to the API.
/// </summary>
public static class HoldingEndpoints
{
    private const string TempUserId = "dev-user-001";

    public static RouteGroupBuilder MapHoldingEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAll);
        group.MapGet("/{id}", GetById);
        group.MapPost("/", Create);
        group.MapDelete("/{id}", Delete);

        return group;
    }

    private static async Task<IResult> GetAll(HoldingService service)
    {
        var holdings = await service.GetByUserIdAsync(TempUserId);
        return Results.Ok(holdings);
    }

    private static async Task<IResult> GetById(HoldingService service, string id)
    {
        var holding = await service.GetByIdAsync(TempUserId, id);
        return holding is null ? Results.NotFound() : Results.Ok(holding);
    }

    private static async Task<IResult> Create(HoldingService service, CreateHoldingRequest request)
    {
        var holding = await service.CreateAsync(TempUserId, request);
        return Results.Created($"/api/holdings/{holding.Id}", holding);
    }

    private static async Task<IResult> Delete(HoldingService service, string id)
    {
        var deleted = await service.DeleteAsync(TempUserId, id);
        return deleted ? Results.NoContent() : Results.NotFound();
    }
}
