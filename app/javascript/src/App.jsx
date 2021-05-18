import React, { useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { initializeLogger } from "common/logger";
const App = () => {
  useEffect(() => {
    initializeLogger();
    logger.info("Log from js-logger");
  }, []);

  return (
    <h1>This is App.jsx</h1>
    // <Router>
    //   <Switch>
    //     <Route exact path="/" render={() => <div>Home</div>} />
    //     <Route exact path="/about" render={() => <div>About</div>} />
    //   </Switch>
    // </Router>
  );
};

export default App;
