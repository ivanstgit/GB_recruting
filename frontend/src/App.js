import React, { Suspense } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// import './App.css';
import './css/bootstrap.min.css'
import './css/style.css'
import './css/all.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";

import './i18n';

import AuthProvider, { userRoles } from "./hooks/AuthProvider";
import DataProvider from './hooks/DataProvider.js';

import AppPaths from "./routes/AppPaths.js"
import AuthRequired from './routes/AuthRequired.js'

import NavGlobal from './components/NavigationGlobal.js';
import NavigationFooter from "./components/NavigationFooter.js";
import NotFound404 from './components/NotFound404.js';
import AccountSignInForm from './pages/account/AccountSignInForm.js';
import AccountSignUpForm from './pages/account/AccountSignUpForm.js';
import AccountConfirmationForm from './pages/account/AccountConfirmationForm.js';

import HomePage from './pages/Home.js';
import NewsPage from './pages/news/News.js';
import PartnersPage from './pages/partners/Partners.js';

import EmployeePage from './pages/employee/Employee.js';
import ModeratorPage from './pages/moderator/Moderator.js';
import EmployerPage from './pages/employer/Employer.js';
import { useTranslation } from 'react-i18next';

const App = (props) => {
  const { t } = useTranslation("Navigation");
  document.title = t("Recruting")

  return (
    <Router>
      <div className="App">
        <AuthProvider> {/* Authentification provider */}
          <DataProvider> {/* Data provider */}

            <NavGlobal />
            <div className="container-fluid p-0 mb-0 mh-100">
              <Suspense>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path={AppPaths.news + "*"} element={<NewsPage />} />
                  <Route path={AppPaths.partners + "*"} element={<PartnersPage />} />

                  <Route exact path={AppPaths.signin} element={<AccountSignInForm />} />
                  <Route exact path={AppPaths.signup} element={<AccountSignUpForm />} />
                  <Route exact path={AppPaths.confirm} element={<AccountConfirmationForm />} />

                  <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.employee} />}>
                    <Route path={AppPaths.employee + "*"} element={<EmployeePage />} />
                  </Route>

                  <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.employer} />}>
                    <Route exact path={AppPaths.employer + "*"} element={<EmployerPage />} />
                  </Route>

                  <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.moderator} />}>
                    <Route path={AppPaths.moderator + "*"} element={<ModeratorPage />} />
                  </Route>

                  <Route element={<NotFound404 />} />
                </Routes>
              </Suspense>
            </div>
            <NavigationFooter />

          </DataProvider>
        </AuthProvider>
      </div>
    </Router>
  )
}

export default App;
