import { useProjects } from "../../features/project/project.api";
import Spinner from "../../components/ui/Spinner";
import Popup from "../../components/ui/Popup";
import { useEffect, useState } from "react";
import GridCard from "./GridCard";


function Home() {

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const { data: projects, isLoading, error } = useProjects();

    // handle error & loading
    useEffect(() => {
        if (error) setShowErrorAlert(true);
    }, [error]);
    if (isLoading) return <Spinner fullScreen="true" />
    

    return ( 
        <div className="max-1600">
        <div>
            <GridCard projects={projects} />
        </div>

        {showErrorAlert && (
            <Popup
                variant="alert"
                open={showErrorAlert}
                onOpenChange={setShowErrorAlert}
                description="A server error occurred. Please try again."
                confirmText="Try Again"
                onConfirm={() => {
                    setShowErrorAlert(false);
                    window.location.reload();
                }}
            />
        )}
        </div>
    );
}

export default Home;