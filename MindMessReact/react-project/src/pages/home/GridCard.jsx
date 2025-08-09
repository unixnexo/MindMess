import NewCardForm from "./NewCardForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCreateProjectUIStore } from "../../features/project/useCreateProjectUIStore";
import { useCreateProject, useUpdateProject } from "../../features/project/project.api";
import { useState } from "react";
import Popup from "../../components/ui/Popup";
import GridCardMenuBar from "./GridCardMenuBar";
import EditCardForm from "./EditCardForm";
import { Link } from "react-router-dom";


export default function GridCard({ projects = [] }) {

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const { isCreatingNew, setIsCreatingNew } = useCreateProjectUIStore();
    const [animationParent] = useAutoAnimate({
        duration: 250,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();


    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getProgressColor = (progress) => {
        return progress === 100 ? 'bg-green-500' : 'bg-main-blue/90';
    };

    // edit
    const handleEdit = (projectId) => {
        setEditingProjectId(projectId);
    };

    const handleUpdateSave = (formData) => {
        const payload = {
            ...formData,
            endDate: formData.endDate === '' ? null : formData.endDate
        };

        updateProject.mutate({ id: editingProjectId, data: payload }, {
            onSuccess: () => {
                setEditingProjectId(null);
            },
            onError: (err) => {
                console.error('Update failed:', err);
                setShowErrorAlert(true);
            }
        });
    };

    const handleEditCancel = () => {
        setEditingProjectId(null);
    };
    //

    // create
    const handleSave = (formData) => {

        const payload = {
            ...formData,
            endDate: formData.endDate === '' ? null : formData.endDate // convert "" to null
        }

        createProject.mutate(payload, {
            onSuccess: () => {
                setIsCreatingNew(false);
            },
            onError: (err) => {
                console.error('Create failed:', err);
                setShowErrorAlert(true);
            }
        })
    };

    const handleCancel = () => {
        setIsCreatingNew(false);
    };
    //

    return (
        <div className="px-2 xs:px-3 lg:px-6 py-8 min-h-screen text-white">
            <div ref={animationParent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-6 mx-auto">
                {/* New card form - appears first */}
                {isCreatingNew && (
                    <NewCardForm onSave={handleSave} onCancel={handleCancel} isCreating={createProject.isLoading} />
                )}
                
                {/* Existing projects */}
                {projects.length === 0 && !isCreatingNew ? (
                    <div className="flex items-center justify-center absolute h-[calc(100dvh-120px)] w-full">No projects</div>
                    ) : (
                    projects.map((project) => (
                        editingProjectId === project.id ? (
                            <EditCardForm 
                                key={project.id}
                                project={project}
                                onSave={handleUpdateSave} 
                                onCancel={handleEditCancel} 
                                isUpdating={updateProject.isLoading} 
                            />
                        ) : (
                        <Link to={`project/${project.id}/tasks`} key={project.id}>
                        <div className="flex flex-col justify-between h-[208px] bg-gradient-backdropy backdrop-blur-[24px] hover:backdrop-blur-[100px] rounded-lg p-3 xs:p-4 lg:p-6 shadow-2xl cursor-pointer transition-all duration-300">
                            {/* Header */}
                            <div className="mb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                        {project.title}
                                    </h3>
                                    {/* menubar */}
                                    <div onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                        }}>
                                        <GridCardMenuBar projectId={project.id} onEdit={handleEdit} />
                                    </div>
                                </div>
                                <p className="text-sm text-white/80 line-clamp-2">
                                    {project.description}
                                </p>
                            </div>

                            <div>
                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-white/80">Progress</span>
                                    <span className="text-xs font-medium text-white/80">{Math.round(parseFloat(project.progress))}%</span>
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
                                <span>{formatDate(project.endDate)}</span>
                            </div>
                            </div>
                        </div>
                        </Link>
                        )
                    ))
                )}
            </div>

            {showErrorAlert && (
                <Popup
                    variant="alert"
                    open={showErrorAlert}
                    onOpenChange={setShowErrorAlert}
                    description="A server error occurred. Please try again."
                    confirmText="Ok"
                    onConfirm={() => {
                        setShowErrorAlert(false);
                    }}
                />
            )}

        </div>
    );
}