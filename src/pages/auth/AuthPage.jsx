import Popup from "../../components/ui/Popup";
import LoginForm from "../../features/auth/LoginForm";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Drawings from "./Drawings";


function AuthPage() {

    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [startAnimation, setStartAnimation] = useState(false);
    const text = "MindMess";

    useEffect(() => {
        const timer = setTimeout(() => {
            setStartAnimation(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // text animation
    const letterVariants = {
        hidden: (i) => ({
            opacity: 0,
            x: i % 4 === 0 ? -200 : i % 4 === 1 ? 200 : i % 4 === 2 ? -150 : 100,
            y: i % 4 === 0 ? -100 : i % 4 === 1 ? 100 : i % 4 === 2 ? 150 : -150,
            rotate: i % 2 === 0 ? -180 : 180,
            scale: 0.3,
        }),
        visible: (i) => ({
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            transition: {
                duration: 0.8 + i * 0.1,
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        }),
    };

    const handleConfirm = () => {
        formRef.current?.submit();
    };

    return (  
        <div className="flex items-center justify-center h-[100dvh] max-1600">

            <Drawings startAnimation={startAnimation} />
            
            <div className="flex flex-col items-center justify-center space-y-[30px]">
                <img src="/logo.webp" className="w-[70%] xs:w-auto" alt="MindMess Logo" />

                <div className="text-center leading-tight">

                    <h1 className="text-[60px] xs:text-[90px] sm:text-[120px]">
                        {text.split("").map((letter, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={letterVariants}
                                initial="hidden"
                                animate={startAnimation ? "visible" : "hidden"}
                                className="inline-block"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </h1>

                    <div className="overflow-hidden">
                        <motion.h2
                            className="text-xs xs:text-sm"
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            transition={{
                                delay: 0.5,
                                duration: 1,
                                ease: "easeOut"
                            }}
                        >
                            no more papers, bring your ideas here
                        </motion.h2>
                    </div>

                </div>

                {/* signIn popup */}
                <Popup
                    trigger={
                        <div className="overflow-hidden">
                            <motion.button
                                className="btn-default"
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{
                                    delay: 1.2,
                                    duration: 0.4,
                                    ease: "easeOut"
                                }}
                            >
                                Sign In
                            </motion.button>
                        </div>
                    }
                    variant="confirm"
                    open={loginOpen}
                    onOpenChange={setLoginOpen}
                    title="Sign In to MindMess"
                    description="Enter your email, we'll send you a magic link."
                    confirmText="Ok"
                    onConfirm={handleConfirm}
                    loading={loading}
                >
                    <LoginForm 
                        ref={formRef} 
                        onSuccess={() => {
                            setLoginOpen(false);  
                            setShowSuccessAlert(true);
                        }}
                        onError={(msg) => {
                            setErrorMessage(msg || 'Failed to send link! Please try again later.')
                            setLoginOpen(false);  
                            setShowErrorAlert(true);
                        }}
                        onLoadingChange={setLoading}
                    />
                </Popup>

                {/* error alert */}
                {showErrorAlert && (
                    <Popup
                        variant="alert"
                        open={showErrorAlert}
                        onOpenChange={setShowErrorAlert}
                        description={errorMessage}
                        confirmText="OK"
                        onConfirm={() => setShowErrorAlert(false)}
                    />
                )}

                {/* success alert */}
                {showSuccessAlert && (
                    <Popup
                        variant="alert"
                        open={showSuccessAlert}
                        onOpenChange={setShowSuccessAlert}
                        description="Link sent to your email. Check your inbox or spam."
                        confirmText="OK"
                        onConfirm={() => setShowSuccessAlert(false)}
                    />
                )}

            </div>

        </div>
    );
}

export default AuthPage;