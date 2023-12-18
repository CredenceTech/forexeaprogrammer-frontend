import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom"
import { useLocalStorage } from "../utils";
const RequireAuth = () => {
    const [name] = useLocalStorage('user')

    console.log(" name", name)

    const location = useLocation()
    return (
        name?.api_key
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
export default RequireAuth;