namespace MONATE.Web.Server.Logics
{
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data.Models;

    public class MonateDbContext : DbContext
    {
        public MonateDbContext(DbContextOptions<MonateDbContext> options) : base(options) 
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserLocation> Locations { get; set; }
        public DbSet<UserProfile> Profiles { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<ApiToken> ApiTokens { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Endpoint> Endpoints { get; set; }
        public DbSet<InputValue> InputValues { get; set; }
        public DbSet<OutputValue> OutputValues { get; set; }
        public DbSet<ValueType> ValueTypes { get; set; }
        public DbSet<Workflow> Workflows { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<CustomNode> CustomNodes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Member>()
                .HasOne(m => m.Owner)
                .WithMany(u => u.Members)
                .HasForeignKey(m => m.OwnerId);
            modelBuilder.Entity<Member>()
                .HasOne(m => m.User)
                .WithMany()
                .HasForeignKey(m => m.UserId);
            modelBuilder.Entity<ApiToken>()
                .HasOne(a => a.User)
                .WithMany(u => u.ApiTokens)
                .HasForeignKey(a => a.UserId);
            modelBuilder.Entity<UserLocation>()
                .HasOne(l => l.User)
                .WithOne(u => u.Location)
                .HasForeignKey<UserLocation>(l => l.UserId);
            modelBuilder.Entity<UserProfile>()
                .HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<UserProfile>(p => p.UserId);
            modelBuilder.Entity<Endpoint>()
                .HasOne(e => e.User)
                .WithMany(u => u.Endpoints)
                .HasForeignKey(e => e.UserId);
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Users)
                .WithMany(u => u.Categories);
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Endpoints)
                .WithMany(e => e.Categories);
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Portfolios)
                .WithMany(p => p.Categories);
            modelBuilder.Entity<Workflow>()
                .HasOne(w => w.Endpoint)
                .WithMany(e => e.Workflows)
                .HasForeignKey(w => w.EndpointId);
            modelBuilder.Entity<InputValue>()
                .HasOne(e => e.Workflow)
                .WithMany(e => e.Inputs)
                .HasForeignKey(e => e.WorkflowId);
            modelBuilder.Entity<OutputValue>()
                .HasOne(e => e.Workflow)
                .WithMany(e => e.Outputs)
                .HasForeignKey(e => e.WorkflowId);
            modelBuilder.Entity<InputValue>()
                .HasOne(e => e.Type)
                .WithMany(e => e.InputValues)
                .HasForeignKey(e => e.TypeId);
            modelBuilder.Entity<OutputValue>()
                .HasOne(e => e.Type)
                .WithMany(e => e.OutputValues)
                .HasForeignKey(e => e.TypeId);
        }
    }
}
