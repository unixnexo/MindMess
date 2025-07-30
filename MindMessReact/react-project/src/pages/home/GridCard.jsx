
function GridCard({ projects }) {

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getProgressColor = (progress) => {
        if (progress === 0) return 'bg-gray-200';
        if (progress < 30) return 'bg-red-400';
        if (progress < 70) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    return (
        <div className="px-2 xs:px-3 lg:px-6 py-8 min-h-screen text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-6 mx-auto">
                {projects.map((project) => (
                    <div key={project.id} className="bg-gradient-backdropy backdrop-blur-[24px] rounded-xl p-6 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform will-change-auto duration-300">
                        {/* Header */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                {project.title}
                            </h3>
                            <p className="text-sm text-white/80 line-clamp-3">
                                {project.description}
                            </p>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-white/80">Progress</span>
                                <span className="text-xs font-medium text-white/80">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-white/80 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center justify-between text-sm text-white/80">
                            <span>{formatDate(project.startDate)}</span>
                            {/* <span>•</span> */}
                            <span>{formatDate(project.endDate)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GridCard;