using Prism.Api.Endpoints;
using Prism.Application.Services;
using Prism.Core.Interfaces;
using Prism.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Dependency Injection
// ---------------------------------------------------------------------------

// Repositories — Singleton because in-memory stores must persist across requests.
// When switching to DynamoDB, change to Scoped.
builder.Services.AddSingleton<ITransactionRepository, InMemoryTransactionRepository>();
builder.Services.AddSingleton<IBudgetRepository, InMemoryBudgetRepository>();
builder.Services.AddSingleton<IHoldingRepository, InMemoryHoldingRepository>();

// Application services
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<BudgetService>();
builder.Services.AddScoped<HoldingService>();

// CORS — allow Next.js dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger / OpenAPI for dev testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Prism Money API", Version = "v1" });
});

var app = builder.Build();

// ---------------------------------------------------------------------------
// Middleware Pipeline
// ---------------------------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

// Health check
app.MapGet("/api/health", () => new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    version = "0.1.0"
}).WithTags("Health");

// Route groups for each domain
app.MapGroup("/api/transactions")
   .MapTransactionEndpoints()
   .WithTags("Transactions");

app.MapGroup("/api/budgets")
   .MapBudgetEndpoints()
   .WithTags("Budgets");

app.MapGroup("/api/holdings")
   .MapHoldingEndpoints()
   .WithTags("Holdings");

app.Run();
