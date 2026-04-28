using Prism.Application.DTOs;
using Prism.Application.Mapping;
using Prism.Core.Enums;
using Prism.Core.Interfaces;

namespace Prism.Application.Services;

public class BudgetService
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly ITransactionRepository _transactionRepository;

    public BudgetService(IBudgetRepository budgetRepository, ITransactionRepository transactionRepository)
    {
        _budgetRepository = budgetRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<BudgetResponse?> GetByIdAsync(string userId, string budgetId)
    {
        var entity = await _budgetRepository.GetByIdAsync(userId, budgetId);
        if (entity is null) return null;

        var spent = await CalculateSpentAmount(userId, entity.Category, entity.Year, entity.Month);
        return BudgetMapper.ToResponse(entity, spent);
    }

    public async Task<IEnumerable<BudgetResponse>> GetByUserIdAsync(string userId, int? year = null, int? month = null)
    {
        var entities = await _budgetRepository.GetByUserIdAsync(userId, year, month);
        var responses = new List<BudgetResponse>();

        foreach (var entity in entities)
        {
            var spent = await CalculateSpentAmount(userId, entity.Category, entity.Year, entity.Month);
            responses.Add(BudgetMapper.ToResponse(entity, spent));
        }

        return responses;
    }

    public async Task<BudgetResponse> CreateAsync(string userId, CreateBudgetRequest request)
    {
        var entity = BudgetMapper.ToEntity(request, userId);
        var created = await _budgetRepository.CreateAsync(entity);
        return BudgetMapper.ToResponse(created, 0m);
    }

    public async Task<bool> DeleteAsync(string userId, string budgetId)
    {
        return await _budgetRepository.DeleteAsync(userId, budgetId);
    }

    /// <summary>
    /// Calculates the total amount spent in a given category for a specific month.
    /// Queries transactions filtered by category, year, and month.
    /// </summary>
    private async Task<decimal> CalculateSpentAmount(string userId, SpendingCategory category, int year, int month)
    {
        var startDate = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endDate = startDate.AddMonths(1).AddTicks(-1);

        var transactions = await _transactionRepository.GetByUserIdAsync(
            userId,
            startDate: startDate,
            endDate: endDate,
            category: category.ToString()
        );

        return transactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);
    }
}
