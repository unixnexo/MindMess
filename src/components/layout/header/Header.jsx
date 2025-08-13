import CustomMenubar from '../../ui/CustomMenubar';
import * as Menubar from '@radix-ui/react-menubar';
import { useAuth } from '@/features/auth/auth.store.js';
import { useCreateProjectUIStore } from "../../../features/project/useCreateProjectUIStore";
import { Link, useLocation } from 'react-router-dom';


function Header() {

    // logout
    const logout = useAuth(state => state.logout);

    // for add btn to create a new project
    const setIsCreatingNewProject = useCreateProjectUIStore((s) => s.setIsCreatingNew);

    // location
    const location = useLocation();
    const isDrawingRoute = location.pathname.includes('/project/') && (location.pathname.includes('/drawing') || location.pathname.includes('/tasks')); // canvas/drawing - taks

    return (  
        <header className="bg-gradient-backdropy backdrop-blur-[24px] text-white shadow-lg py-2 px-4 h-[43px]">
        <div className='max-1600 flex justify-between items-center'>
            <div className="flex items-center space-x-2">
                {/* <img src="/logo.webp" width="30" alt="MindMess Logo" /> */}
                <p>MindMess</p>
            </div>

            <div className="flex items-center fill-white/85 space-x-1">
                {isDrawingRoute ? (
                    // get back to home
                    <Link to="/app/" className='hover:bg-white/10 cursor-pointer p-1.5 rounded-md select-none stroke-white/80'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    </Link>
                ) : (
                    // add
                    <div onClick={() => setIsCreatingNewProject(true)} className='hover:bg-white/10 cursor-pointer p-1.5 rounded-md select-none'>
                        <svg height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><path d="M29.9475268,59.5867724 C46.1333288,59.5867724 59.534715,46.15661 59.534715,29.9998218 C59.534715,13.8140198 46.1043387,0.412871288 29.9185367,0.412871288 C13.7617248,0.412871288 0.36059406,13.8140198 0.36059406,29.9998218 C0.36059406,46.15661 13.7907743,59.5867724 29.9475268,59.5867724 Z M29.9475268,54.6556041 C16.256299,54.6556041 5.32073466,43.6910496 5.32073466,29.9998218 C5.32073466,16.3085941 16.2273089,5.34403961 29.9185367,5.34403961 C43.6097644,5.34403961 54.5743189,16.3085941 54.6035429,29.9998218 C54.6325367,43.6910496 43.6387545,54.6556041 29.9475268,54.6556041 Z M17.1265367,30.0288119 C17.1265367,31.4501585 18.1417842,32.4073664 19.6211109,32.4073664 L27.4819426,32.4073664 L27.4819426,40.3262377 C27.4819426,41.7765743 28.4682,42.7628318 29.8895466,42.7628318 C31.3398832,42.7628318 32.3551307,41.7765743 32.3551307,40.3262377 L32.3551307,32.4073664 L40.2449525,32.4073664 C41.6952892,32.4073664 42.7105367,31.4501585 42.7105367,30.0288119 C42.7105367,28.5784753 41.6952892,27.5632278 40.2449525,27.5632278 L32.3551307,27.5632278 L32.3551307,19.7023961 C32.3551307,18.1940198 31.3398832,17.2078218 29.8895466,17.2078218 C28.4682,17.2078218 27.4819426,18.2230693 27.4819426,19.7023961 L27.4819426,27.5632278 L19.6211109,27.5632278 C18.1417842,27.5632278 17.1265367,28.5784753 17.1265367,30.0288119 Z" transform="translate(2 2)"></path></svg>
                    </div>
                )}
                
                {/* the guy */}
                <CustomMenubar
                    trigger={
                        <div className='hover:bg-white/10 cursor-pointer p-1.5 rounded-md select-none'>
                            <svg height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.918 20.928"><path d="M10.459 20.918c5.722 0 10.459-4.748 10.459-10.459C20.918 4.737 16.17 0 10.448 0 4.739 0 0 4.737 0 10.459c0 5.711 4.748 10.459 10.459 10.459Zm0-1.743a8.674 8.674 0 0 1-8.706-8.716c0-4.84 3.856-8.716 8.696-8.716a8.691 8.691 0 0 1 8.726 8.716 8.682 8.682 0 0 1-8.716 8.716Zm7.014-1.959-.031-.113c-.503-1.507-3.21-3.158-6.983-3.158-3.763 0-6.47 1.651-6.983 3.148l-.03.123c1.845 1.825 5.013 2.892 7.013 2.892 2.01 0 5.147-1.056 7.014-2.892Zm-7.014-5.014c1.979.02 3.517-1.661 3.517-3.866 0-2.07-1.548-3.783-3.517-3.783-1.969 0-3.527 1.712-3.517 3.783.01 2.205 1.548 3.846 3.517 3.866Z"></path></svg>
                        </div>
                    }
                >
                    <Menubar.Item className="menubar-item border-b border-border bg-hover">
                        <p>unixnexo@gmail.com</p>
                    </Menubar.Item>
                    <Menubar.Item className="menubar-item cursor-pointer" onClick={logout}>
                        <div className='flex items-center justify-between text-red fill-red'>
                            <p>Sing Out</p>
                            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M7 14a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-1.167a5.833 5.833 0 1 1 0-11.666 5.833 5.833 0 0 1 0 11.666zM4.526 4.526a.438.438 0 0 1 .619 0L7 6.381l1.855-1.855a.438.438 0 0 1 .619.619L7.619 7l1.855 1.855a.438.438 0 0 1-.619.619L7 7.619l-1.855 1.855a.438.438 0 0 1-.619-.619L6.381 7 4.526 5.145a.438.438 0 0 1 0-.619z"/></svg>
                        </div>
                    </Menubar.Item>
                </CustomMenubar>
            </div>
        </div>
        </header>
    );
}

export default Header;