import NewCardForm from "./NewCardForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCreateProjectUIStore } from "../../features/project/useCreateProjectUIStore";
import { useCreateProject } from "../../features/project/project.api";
import { useState } from "react";
import Popup from "../../components/ui/Popup";
import CustomMenubar from '../../components/ui/CustomMenubar';
import * as Menubar from '@radix-ui/react-menubar';


export default function GridCard({ projects }) {

    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { isCreatingNew, setIsCreatingNew } = useCreateProjectUIStore();
    const [animationParent] = useAutoAnimate({
        duration: 250,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    const createProject = useCreateProject();


    const formatDate = (dateString) => {
        if (!dateString) return null;
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
                        <div key={project.id} className="h-[196px] bg-gradient-backdropy backdrop-blur-[24px] hover:backdrop-blur-[100px] rounded-xl p-6 shadow-2xl cursor-pointer transition-all duration-300">
                            {/* Header */}
                            <div className="mb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                        {project.title}
                                    </h3>
                                    {/* menubar */}
                                    <div>
                                        <CustomMenubar
                                            trigger={
                                                <div className='hover:bg-white/10 cursor-pointer p-1.5 rounded-md select-none'>
                                                    <svg width="22" height="22" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><circle fill="var(--iconCircleFill, transparent)" cx="14" cy="14" r="14"></circle><path fill="var(--iconEllipsisFill, white)" d="M10.105 14c0-.87-.687-1.55-1.564-1.55-.862 0-1.557.695-1.557 1.55 0 .848.695 1.55 1.557 1.55.855 0 1.564-.702 1.564-1.55zm5.437 0c0-.87-.68-1.55-1.542-1.55A1.55 1.55 0 0012.45 14c0 .848.695 1.55 1.55 1.55.848 0 1.542-.702 1.542-1.55zm5.474 0c0-.87-.687-1.55-1.557-1.55-.87 0-1.564.695-1.564 1.55 0 .848.694 1.55 1.564 1.55.848 0 1.557-.702 1.557-1.55z"></path></svg>
                                                </div>
                                            }
                                        >
                                            <Menubar.Item className="menubar-item cursor-pointer border-b border-border">
                                                <div className="flex justify-between items-center stroke-black/80">
                                                    <span>Canvas</span>
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-icon lucide-brush"><path d="m11 10 3 3"/><path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"/><path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"/></svg>
                                                    </div>
                                                </div>
                                            </Menubar.Item>
                                            <Menubar.Item className="menubar-item cursor-pointer border-b border-border">
                                                <span>Edit</span>
                                            </Menubar.Item>
                                            <Menubar.Item className="menubar-item cursor-pointer">
                                                <span>Delete</span>
                                            </Menubar.Item>
                                        </CustomMenubar>
                                    </div>
                                </div>
                                <p className="text-sm text-white/80 line-clamp-2">
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
                                <span>{formatDate(project.endDate)}</span>
                            </div>
                        </div>
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