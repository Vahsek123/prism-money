using Prism.Application.DTOs;
using Prism.Application.Services;

namespace Prism.Api.Endpoints;

/// <summary>
/// Maps Transaction CRUD endpoints to the API.
/// Uses .NET Minimal API pattern with route groups.
/// </summary>
public static class TransactionEndpoints
{
    // TODO: Replace with actual user ID from JWT claims after auth is implemented
    private const string TempUserId = "dev-user-001";

    public static RouteGroupBuilder MapTransactionEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAll);
        group.MapGet("/{id}", GetById);
        group.MapPost("/", Create);
        group.MapPut("/{id}", Update);
        group.MapDelete("/{id}", Delete);

        return group;
    }

    private static async Task<IResult> GetAll(
        TransactionService service,
        DateTime? startDate,
        DateTime? endDate,
        string? category,
        int limit = 50)
    {
        var transactions = await service.GetByUserIdAsync(TempUserId, startDate, endDate, category, limit);
        return Results.Ok(transactions);
    }

    private static async Task<IResult> GetById(TransactionService service, string id)
    {
        var transaction = await service.GetByIdAsync(TempUserId, id);
        return transaction is null ? Results.NotFound() : Results.Ok(transaction);
    }

    private static async Task<IResult> Create(TransactionService service, CreateTransactionRequest request)
    {
        var transaction = await service.CreateAsync(TempUserId, request);
        return Results.Created($"/api/transactions/{transaction.Id}", transaction);
    }

    private static async Task<IResult> Update(TransactionService service, string id, UpdateTransactionRequest request)
    {
        var transaction = await service.UpdateAsync(TempUserId, id, request);
        return transaction is null ? Results.NotFound() : Results.Ok(transaction);
    }

    private static async Task<IResult> Delete(TransactionService service, string id)
    {
        var deleted = await service.DeleteAsync(TempUserId, id);
        return deleted ? Results.NoContent() : Results.NotFound();
    }
}
