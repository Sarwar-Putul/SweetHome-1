
import React, { createContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";





export const UserContext = createContext();

import React from 'react';
import Homepage from './pages/Homepage/Homepage';
import './App.css';


const App = () => {
  const [loggedInUser, setLoggedInUser] = useState({});

  return (

    <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Router>
        <Switch>

          <Route path="/login">
            <Login />
          </Route>

        </Switch>
      </Router>
     </UserContext.Provider>

    <div>
      <Homepage />
    </div>

  );
};

export default App;