import CustomMenubar from '../../components/ui/CustomMenubar';
import * as Menubar from '@radix-ui/react-menubar';
import { useDeleteProject } from '../../features/project/project.api';
import Popup from '../../components/ui/Popup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function GridCardMenuBar({ projectId, onEdit }) {

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const deleteProject = useDeleteProject();
    const navigate = useNavigate();

    const handleDelete = async (projectId) => {
        try {
            await deleteProject.mutateAsync(projectId);
        } catch (error) {
            setShowErrorPopup(true);
            setShowDeletePopup(false);
            console.error('Delete failed:', error);
        }
    };

    return ( 
    <>
        <CustomMenubar
            trigger={
                <div className='hover:bg-white/10 cursor-pointer p-1.5 rounded-md select-none'>
                    <svg width="22" height="22" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><circle fill="var(--iconCircleFill, transparent)" cx="14" cy="14" r="14"></circle><path fill="var(--iconEllipsisFill, white)" d="M10.105 14c0-.87-.687-1.55-1.564-1.55-.862 0-1.557.695-1.557 1.55 0 .848.695 1.55 1.557 1.55.855 0 1.564-.702 1.564-1.55zm5.437 0c0-.87-.68-1.55-1.542-1.55A1.55 1.55 0 0012.45 14c0 .848.695 1.55 1.55 1.55.848 0 1.542-.702 1.542-1.55zm5.474 0c0-.87-.687-1.55-1.557-1.55-.87 0-1.564.695-1.564 1.55 0 .848.694 1.55 1.564 1.55.848 0 1.557-.702 1.557-1.55z"></path></svg>
                </div>
            }
        >
            {/* canvas */}
            <Menubar.Item onClick={() => navigate(`/app/project/${projectId}/drawing`)} className="menubar-item cursor-pointer border-b border-border">
                <div className="flex justify-between items-center stroke-black/80">
                    <span>Canvas</span>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 10 3 3"/><path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"/><path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"/></svg>
                    </div>
                </div>
            </Menubar.Item>
            {/* edit */}
            <Menubar.Item onClick={() => onEdit(projectId)} className="menubar-item cursor-pointer border-b border-border">
                <div className="flex justify-between items-center fill-black/80">
                    <span>Edit</span>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" stroke="none" height="14" fillRule="evenodd" strokeLinejoin="round" strokeWidth="1" strokeMiterlimit="1" clipRule="evenodd" version="1.1" viewBox="0 0 16 16" xmlSpace="preserve"><path fillRule="nonzero" d="M31.475,57.622C32.114,57.622 32.702,57.571 33.34,57.52L34.77,60.228C35.077,60.891 35.766,61.249 36.558,61.12C37.298,60.994 37.809,60.43 37.912,59.665L38.346,56.651C39.546,56.32 40.696,55.885 41.845,55.4L44.066,57.392C44.629,57.928 45.369,58.031 46.085,57.648C46.749,57.263 47.005,56.575 46.877,55.809L46.238,52.82C47.26,52.115 48.218,51.321 49.098,50.445L51.883,51.62C52.597,51.928 53.313,51.748 53.849,51.11C54.334,50.548 54.411,49.806 53.977,49.143L52.367,46.537C53.079,45.524 53.695,44.446 54.207,43.318L57.247,43.472C58.012,43.498 58.677,43.089 58.907,42.349C59.163,41.658 58.933,40.876 58.345,40.432L55.945,38.543C56.249,37.393 56.505,36.143 56.606,34.866L59.468,33.946C60.234,33.716 60.694,33.128 60.694,32.362C60.694,31.571 60.234,31.008 59.468,30.752L56.606,29.834C56.505,28.557 56.249,27.357 55.945,26.157L58.318,24.265C58.932,23.806 59.162,23.091 58.906,22.375C58.676,21.66 58.012,21.226 57.245,21.252L54.206,21.38C53.645,20.23 53.083,19.183 52.368,18.135L53.977,15.555C54.387,14.965 54.334,14.17 53.849,13.64C53.312,12.977 52.597,12.825 51.883,13.105L49.098,14.254C48.198,13.4 47.242,12.606 46.237,11.878L46.877,8.915C47.005,8.149 46.723,7.434 46.085,7.077C45.369,6.692 44.629,6.769 44.066,7.332L41.846,9.298C40.702,8.821 39.535,8.404 38.348,8.048L37.914,5.058C37.834,4.32 37.267,3.722 36.534,3.603C35.768,3.5 35.078,3.833 34.772,4.471L33.342,7.178C32.703,7.154 32.115,7.102 31.477,7.102C30.838,7.102 30.251,7.154 29.612,7.178L28.182,4.471C27.849,3.832 27.186,3.501 26.394,3.603C25.654,3.731 25.144,4.293 25.04,5.058L24.606,8.048C23.406,8.405 22.231,8.814 21.108,9.298L18.885,7.332C18.298,6.769 17.583,6.694 16.842,7.077C16.203,7.434 15.949,8.149 16.075,8.942L16.714,11.878C15.709,12.606 14.753,13.4 13.852,14.254L11.069,13.104C10.329,12.824 9.639,12.977 9.077,13.64C8.618,14.179 8.566,14.96 8.949,15.555L10.559,18.135C9.875,19.17 9.269,20.255 8.746,21.38L5.68,21.252C4.941,21.219 4.264,21.677 4.02,22.375C3.79,23.091 3.995,23.806 4.608,24.266L6.982,26.154C6.7,27.354 6.445,28.554 6.343,29.831L3.457,30.751C2.717,30.981 2.282,31.569 2.282,32.36C2.282,33.126 2.717,33.714 3.457,33.945L6.343,34.889C6.445,36.14 6.675,37.392 6.982,38.542L4.606,40.43C4.022,40.877 3.785,41.65 4.018,42.347C4.253,43.052 4.938,43.515 5.68,43.47L8.745,43.316C9.28,44.466 9.868,45.539 10.557,46.534L8.947,49.141C8.551,49.751 8.604,50.554 9.077,51.107C9.64,51.745 10.329,51.924 11.069,51.617L13.828,50.442C14.722,51.312 15.688,52.107 16.714,52.817L16.075,55.807C15.948,56.573 16.203,57.262 16.868,57.645C17.583,58.028 18.298,57.925 18.86,57.415L21.106,55.397C22.231,55.882 23.406,56.317 24.606,56.648L25.04,59.664C25.143,60.428 25.654,60.991 26.394,61.144C27.186,61.247 27.849,60.888 28.182,60.225L29.612,57.517C30.251,57.568 30.838,57.619 31.477,57.619L31.475,57.621L31.475,57.622ZM38.168,30.345C36.891,27.049 34.337,25.262 31.322,25.262C30.762,25.261 30.205,25.33 29.662,25.466L22.766,13.64C25.492,12.368 28.466,11.714 31.474,11.724C42.254,11.724 50.732,19.822 51.729,30.344L38.168,30.344L38.168,30.345ZM11.145,32.362C11.145,25.543 14.286,19.515 19.242,15.762L26.188,27.637C24.834,29.145 24.222,30.752 24.222,32.438C24.222,34.074 24.809,35.58 26.188,37.138L19.063,48.835C14.209,45.055 11.145,39.105 11.145,32.362ZM28.283,32.412C28.283,30.702 29.738,29.374 31.373,29.374C33.085,29.374 34.489,30.702 34.489,32.412C34.481,34.114 33.076,35.509 31.374,35.505C29.738,35.505 28.282,34.125 28.282,32.412L28.283,32.412ZM31.475,53.025C28.257,53.025 25.218,52.285 22.562,50.982L29.637,39.386C30.377,39.565 30.887,39.616 31.322,39.616C34.362,39.616 36.915,37.776 38.168,34.405L51.729,34.405C50.732,44.903 42.252,53.025 31.475,53.025Z" transform="matrix(.27119 0 0 .27119 -.54 -.78)"></path></svg>
                    </div>
                </div>
            </Menubar.Item>
            {/* delete */}
            <Menubar.Item onClick={() => setShowDeletePopup(true)} className="menubar-item cursor-pointer">
                <div className="flex justify-between items-center stroke-red text-red">
                    <span>Delete</span>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </div>
                </div>
            </Menubar.Item>
        </CustomMenubar>

        {/* delete confirm popup */}
        {showDeletePopup && (
            <Popup
                variant="confirm"
                open={showDeletePopup}
                onOpenChange={setShowDeletePopup}
                description="This action cannot be undone. Are you sure you want to delete the project?"
                confirmText="DELETE"
                confirmStyle="destructive"
                onConfirm={() => handleDelete(projectId)}
            />
        )}

        {/* error alert */}
        {showErrorPopup && (
            <Popup
                variant="alert"
                open={showErrorPopup}
                onOpenChange={setShowErrorPopup}
                description="Something went wrong on the server. Try again later."
                confirmText="OK"
                onConfirm={() => setShowErrorPopup(false)}
            />
        )}
    </>
    );
}

export default GridCardMenuBar;