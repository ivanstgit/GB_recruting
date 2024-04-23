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

// import TranslationProvider from './hooks/TranslationProvider.js';
import './i18n';

import AuthProvider, { userRoles } from "./hooks/AuthProvider";
import DataProvider from './hooks/DataProvider.js';

import AppPaths from "./routes/AppPaths.js"
import AuthRequired from './routes/AuthRequired.js'

import NavGlobal from './components/NavigationGlobal.js';
import NavigationFooter from "./components/NavigationFooter.js";
import PublicHome from './components/PublicHome.js'
import PublicNewsList from './components/PublicNews.js';
import PublicNewsDetail from './components/PublicNewsDetail.js';
import NotFound404 from './components/PublicNotFound404.js';
import AccountSignInForm from './components/AccountSignInForm.js';
import AccountSignUpForm from './components/AccountSignUpForm.js';
import AccountConfirmationForm from './components/AccountConfirmationForm.js';
import EmployeeHome from './components/EmployeeHome.js';
import EmployerHome from './components/EmployerHome.js';
import ModeratorHome from './components/ModeratorHome.js';
import ModeratorNewsList from './components/ModeratorNews.js';
import ModeratorNewsForm from './components/ModeratorNewsForm.js';
import EmployeeProfileForm from './components/EmployeeProfileForm.js';


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      NotFound404: 'Страница не найдена'
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <Router>
        <div className="App">
          <AuthProvider> {/* Authentification provider */}
            <DataProvider> {/* Data provider */}

              <NavGlobal />
              <div className="container-fluid p-0 mb-0 mh-100">
                <Suspense>
                  <Routes>
                    <Route exact path={AppPaths.home} element={<PublicHome />} />
                    <Route exact path={AppPaths.news} element={<PublicNewsList asCards={false} />} />
                    <Route exact path={AppPaths.news + ":id"} element={<PublicNewsDetail />} />
                    <Route exact path={AppPaths.signin} element={<AccountSignInForm />} />
                    <Route exact path={AppPaths.signup} element={<AccountSignUpForm />} />
                    <Route exact path={AppPaths.confirm} element={<AccountConfirmationForm />} />

                    <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.employee} />}>
                      <Route exact path={AppPaths.employee.home} element={<EmployeeHome />} />
                    </Route>
                    <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.employee} />}>
                      <Route exact path={AppPaths.employee.profile} element={<EmployeeProfileForm />} />
                    </Route>

                    <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.employer} />}>
                      <Route exact path={AppPaths.employer.home} element={<EmployerHome />} />
                    </Route>

                    <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.moderator} />}>
                      <Route exact path={AppPaths.moderator.home} element={<ModeratorHome />} />
                    </Route>

                    <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.moderator} />}>
                      <Route exact path={AppPaths.moderator.news} element={<ModeratorNewsList />} />
                    </Route>
                    <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.moderator} />}>
                      <Route exact path={AppPaths.moderator.news + ":id"} element={<PublicNewsDetail />} />
                    </Route>
                    <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.moderator} />}>
                      <Route exact path={AppPaths.moderator.newsCreate} element={<ModeratorNewsForm />} />
                    </Route>
                    <Route element={<AuthRequired redirectPath={AppPaths.signin} role={userRoles.moderator} />}>
                      <Route exact path={AppPaths.moderator.newsEdit + ":id"} element={<ModeratorNewsForm />} />
                    </Route>


                    <Route element={<NotFound404 />} />
                  </Routes>
                </Suspense>
              </div>
              <NavigationFooter note="Footer Note" />

            </DataProvider>
          </AuthProvider>
        </div>
      </Router>
    )
  }

}

export default App;
