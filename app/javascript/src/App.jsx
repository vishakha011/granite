import React, { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { either, isEmpty, isNil } from "ramda";
import { initializeLogger } from "common/logger";
import { ToastContainer } from "react-toastify";

import Dashboard from "components/Dashboard";
import CreateTask from "components/Tasks/CreateTask";
import ShowTask from "components/Tasks/ShowTask";
import EditTask from "components/Tasks/EditTask";
import Signup from "components/Authentication/Signup";
import Login from "components/Authentication/Login";
import PrivateRoute from "components/Common/PrivateRoute";
import { getFromLocalStorage } from "helpers/storage";
import { registerIntercepts, setAuthHeaders } from "apis/axios";
import PageLoader from "components/PageLoader";

const App = () => {
  const [loading, setLoading] = useState(true);
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken) && authToken !== "null";

  useEffect(() => {
    initializeLogger();
    logger.info("Log from js-logger");
    registerIntercepts();
    setAuthHeaders(setLoading);
  }, []);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer />
      <Switch>
        <Route exact path="/tasks/create" component={CreateTask} />
        <Route exact path="/tasks/:slug/show" component={ShowTask} />
        <Route exact path="/tasks/:slug/edit" component={EditTask} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute
          path="/"
          redirectRoute="/login"
          condition={isLoggedIn}
          component={Dashboard}
        />
      </Switch>
    </Router>
  );
};

export default App;
