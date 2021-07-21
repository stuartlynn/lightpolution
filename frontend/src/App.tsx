import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";
import { HomePage } from "Pages/HomePage/HomePage";
import { useAuth } from "Hooks/useAuth";
import { useUser } from "Hooks/useUser";
import { ClassificationProvider } from "Contexts/ClassificationContext";
import { ZooHeader } from "@zooniverse/react-components";

function App() {
  useAuth();
  const { user, error, signOut, signIn } = useUser();
  console.log("user is ", user);

  return (
    <div className="App">
      <ClassificationProvider>
        <Router>
          <ZooHeader
            user={user}
            signOut={() => signOut()}
            signIn={() => signIn()}
            style={{zIndex:10000, position:'relative'}}
            />
            <Switch>
              <Route path="/" component={HomePage} exact />
            </Switch>
        </Router>
      </ClassificationProvider>
    </div>
  );
}

export default App;
