import { jwtDecode } from 'jwt-decode'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from "sonner"
import ADMIN_ROUTES from '../routes/ADMIN_ROUTES'
import { PERMISSIONS } from '../routes/PERMISSIONS'
import { getFromStorage } from '../services/tokenStore/storageHelper'

const ProtectedRoute = ({ children, pageUrl }) => {
    const token = getFromStorage()
    const location = useLocation();

    if (!token) return <Navigate to={ADMIN_ROUTES.LOGIN} replace />

    try {
        const decoded = jwtDecode(token.refreshToken)
        const isExpired = decoded.exp * 1000 < Date.now()
        if (isExpired) return <Navigate to={ADMIN_ROUTES.LOGIN} replace />

        // Extract roles safely
        const userRoles = decoded?.role

        const hasAccess = PERMISSIONS[userRoles].includes(pageUrl)

        if (!hasAccess) {
            toast.error('This user Role is not allowed  ')
            return <Navigate to={ADMIN_ROUTES.UNAUTHORIZED} replace />
        }

        return children
    } catch {
        return <Navigate to={ADMIN_ROUTES.LOGIN} replace />
    }
}

export default ProtectedRoute
