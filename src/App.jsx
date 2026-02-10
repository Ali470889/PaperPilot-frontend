// import { Suspense, useState } from 'react'
// import { Route, Routes } from 'react-router-dom'
// import './App.css'


// // Routes
// import ADMIN_ROUTES from './routes/ADMIN_ROUTES'

// // Components
// import Loading from './components/shared/Loading'

// // Pages
// import Login from './pages/general/login/Login'
// import NotFound from './pages/general/notFound/NotFound'
// import Dashboard from './pages/general/dashboard/Dashboard'
// import Unauthorized from './pages/general/unauthorized/Unauthorized'

// import AuthProvider from './auth/AuthContext'
// import ProtectedRoute from './auth/ProtectedRoute'
// import AppLayout from './layout/AppLayout'

// function App() {

//   return (
//     <AuthProvider>
//       <Suspense fallback={<Loading />}>
//         <Routes>
//           <Route path={ADMIN_ROUTES.LOGIN} element={<Login />} />
//           <Route path={"/"} element={<AppLayout />} >
//             <Route
//               path={ADMIN_ROUTES.DASHBOARD}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.DASHBOARD}>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.QUIZ}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.QUIZ}>
//                   <QuizPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.QUESTION}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.QUESTION}>
//                   <QuestionPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.SUBJECT}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.SUBJECT}>
//                   <SubjectPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.COURSE}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.COURSE}>
//                   <CoursePage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.CHAPTER}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.CHAPTER}>
//                   <ChapterPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.BUNDLE}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.BUNDLE}>
//                   <BundlesPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.BATCH}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.BATCH}>
//                   <BatchPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.TOPIC}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.TOPIC}>
//                   <TopicPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.VIDEO}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.VIDEO}>
//                   <VideoPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.SECTION}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.SECTION}>
//                   <SectionPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.READING}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.READING}>
//                   <ReadingPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.ADVERTISEMENT}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.ADVERTISEMENT}>
//                   <AdvertisementPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.FLASHCARD}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.FLASHCARD}>
//                   <FlashcardPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.SHOP_PAYMENT}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.SHOP_PAYMENT}>
//                   <Payment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.INSTALLMENT}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.INSTALLMENT}>
//                   <InstallmentPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.SHOP_PURCHASE}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.SHOP_PURCHASE}>
//                   <ShopPurchasePage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.PURCHASE_TRACK}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.PURCHASE_TRACK}>
//                   <PurchaseTrackPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.STUDENT}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.STUDENT}>
//                   <StudentPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path={ADMIN_ROUTES.PRM_DASHBOARD}
//               element={
//                 <ProtectedRoute pageUrl={ADMIN_ROUTES.PRM_DASHBOARD}>
//                   <PRMDashboardPage />
//                 </ProtectedRoute>
//               }
//             />



//           </Route>
//           <Route path={ADMIN_ROUTES.UNAUTHORIZED} element={<Unauthorized />} />


//           {/* Catch-all route for 404 */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Suspense>
//     </AuthProvider>
//   )
// }

// export default App




import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

// Routes
import ADMIN_ROUTES from './routes/ADMIN_ROUTES'

// Components
import Loading from './components/shared/Loading'

// Pages
import Login from './pages/general/login/Login'
import NotFound from './pages/general/notFound/NotFound'
import Dashboard from './pages/general/dashboard/Dashboard'
import Unauthorized from './pages/general/unauthorized/Unauthorized'

// Auth & Layout
import AuthProvider from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import AppLayout from './layout/AppLayout'

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={ADMIN_ROUTES.LOGIN} element={<Login />} />
          <Route path="/" element={<AppLayout />} >
            <Route
              path={ADMIN_ROUTES.DASHBOARD}
              element={
                <ProtectedRoute pageUrl={ADMIN_ROUTES.DASHBOARD}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* باقی routes کے لیے وہی structure استعمال کریں */}
            <Route path={ADMIN_ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App
