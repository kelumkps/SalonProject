import React from 'react';
import { Navbar} from 'react-bootstrap';
import {Route, Switch} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import LoadingIndicator from './components/LoadingIndicator';
import AppNotificationComponent from './components/AppNotificationComponent';
import ChooseService from './components/ChooseService';
import ChooseSlot from './components/ChooseSlot';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div>
              <Navbar bg="dark" variant="dark">
                <Navbar.Brand >AR Salon and Day Spa</Navbar.Brand>
              </Navbar>
          </div>
          <header className="App-header">
            <div>
              <LoadingIndicator/>
              <AppNotificationComponent/>
              <Switch>
                    <Route exact path="/" component={ChooseService}>
                    </Route>
                    <Route path="/chooseslot/:serviceId/:serviceName"  component={ChooseSlot}>
                    </Route>
                    <Route>
                        <ChooseService />
                    </Route>
                </Switch>
            </div>
          </header>
        </div>
      </Router>
    );
  }

}


export default App;
