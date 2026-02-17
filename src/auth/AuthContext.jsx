import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getFromStorage } from '../services/tokenStore/storageHelper'
import { jwtDecode } from 'jwt-decode'
import ADMIN_ROUTES from '../routes/ADMIN_ROUTES'

const AuthContext = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const token = getFromStorage()
        const currentPath = location.pathname

        if (!token) {


            if (currentPath !== ADMIN_ROUTES.LOGIN || currentPath !== '/') navigate(ADMIN_ROUTES.LOGIN)
            return
        }

        try {

            const decoded = jwtDecode(token.refreshToken)

            const isExpired = decoded.exp * 1000 < Date.now()

            if (isExpired) {
                if (currentPath !== ADMIN_ROUTES.LOGIN) navigate(ADMIN_ROUTES.LOGIN)
            } else {
                if (currentPath === ADMIN_ROUTES.LOGIN || currentPath == '/') {
                    navigate(ADMIN_ROUTES.DASHBOARD);
                    // if (userRoles.includes("admin")) {
                    //     navigate(ADMIN_ROUTES.DASHBOARD);
                    // } else if (userRoles.includes("content_admin")) {
                    //     navigate(ADMIN_ROUTES.COURSE);
                    // } else if (userRoles.includes("finance_admin")) {
                    //     navigate(ADMIN_ROUTES.SHOP_PAYMENT);
                    // } else if (userRoles.includes("student_admin")) {
                    //     navigate(ADMIN_ROUTES.PURCHASE_TRACK);
                    // } else {
                    //     navigate(ADMIN_ROUTES.UNAUTHORIZED);

                    // }
                }
            }
        } catch {
            if (currentPath !== ADMIN_ROUTES.LOGIN) navigate(ADMIN_ROUTES.LOGIN)
        }
    }, [])

    return <>{children}</>
}

export default AuthContext
