namespace MindMess.Repositories.Project
{
    public interface IProjectRepo
    {
        Task<Models.Project?> GetByIdAsync(Guid id, Guid userId);
        Task<List<Models.Project>> GetAllByUserAsync(Guid userId);
        Task AddAsync(Models.Project project);
        Task UpdateAsync(Models.Project project);
        Task DeleteAsync(Models.Project project);
        Task SaveAsync();
    }

}
