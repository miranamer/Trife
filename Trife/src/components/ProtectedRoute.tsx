import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/Auth";

const ProtectedRoute = ({ children }: any) => {
    const { user } = useAuth()

    if (!user) {
        // user is not authenticated
        return <Navigate to="/home" />;
    }
    return <>{children}</>
};

export default ProtectedRoute