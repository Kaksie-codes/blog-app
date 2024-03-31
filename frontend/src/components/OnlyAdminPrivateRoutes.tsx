import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoutes = () => {
    const { userInfo } = useSelector((state:any) => state.auth);
    
    // Check if userInfo is undefined or null
    if (userInfo === undefined || userInfo === null) {
        return <Navigate to="/signin" replace />;
    }

    const { role } = userInfo;

    // Check if the role is 'admin'
    return role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default OnlyAdminPrivateRoutes;
