import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

// import './App.css';
import './css/bootstrap.min.css'
import './css/style.css'

import AuthProvider from "./hooks/AuthProvider";
import { AuthContext } from "./hooks/AuthProvider";
import DataProvider from './hooks/DataProvider.js';

import AppPaths from "./routes/AppPaths.js"
import AuthRequired from './routes/AuthRequired.js'

import Home from './components/Home.js'
import Menu from "./components/Menu.js";
import Footer from "./components/Footer.js";


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
          {/* Это пример технического компонента на классе, хранит состояние аутентификации */}
          <AuthProvider>
            {/* Это пример технического компонента на функции, хранит данные */}
            <DataProvider>

              {/* Это пример компонента на функции, контекст передаем через хук */}
              <Menu title="Menu" />
              <div className="container-fluid py-5">
                <Routes>
                  <Route exact path={AppPaths.home} element={<Home />} />

                  <Route component={App.NotFound404} />
                </Routes>
              </div>

              <Footer note="Footer Note" />

            </DataProvider>
          </AuthProvider>
        </div>
      </Router>
    )
  }

}


export default App;