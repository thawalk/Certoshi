import React, { Component } from "react";
import "./App.css";
import SignIn from "./Components/SignIn";
import { Switch, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Homepage from "./Components/Homepage";
import Dashboard from "./Components/Dashboard";
import GenerateForm from './Components/GenerateForm';
import Admin from './Components/Admin';
import GenerateCert from './Components/GenerateCert';
import CertificateDisplay from './Components/CertificateDisplay'

class App extends Component {
  render() {
    return (
      <div className="App" style={{ backgroundColor: "#fafafa" }}>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/admin" component={Admin}/>
          <Route exact path="/generateCert" component={GenerateCert}/>
          <Route path="/login" component={SignIn} />
          <Route path="/generate-certificate" component={GenerateForm} />
          <Route path="/display/certificate/:id" component={CertificateDisplay} />
        </Switch>
      </div>
    );
  }
}

export default App;
