import React from 'react';
import { Navbar} from 'react-bootstrap';
import {Route, Switch} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import LoadingIndicator from './components/LoadingIndicator';
import AppNotificationComponent from './components/AppNotificationComponent';
import ChooseService from './components/ChooseService';
import ChooseSlot from './components/ChooseSlot';
import PaymentContainer from './components/PaymentContainer';
import VerifyUser from './components/VerifyUser';

const stripePromise = loadStripe("<STRIPE_PUBLIC_KEY>");

class App extends React.Component {
  render() {
    return (
      <Elements stripe={stripePromise}>
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
                      <Route exact path="/" component={ChooseService}></Route>
                      <Route path="/chooseslot/:serviceId/:serviceName"  component={ChooseSlot}></Route>
                      <Route path="/makepayment/:slotId/:serviceId/:serviceName"  component={PaymentContainer}></Route>
                      <Route path="/admin/verifyuser"  component={VerifyUser}></Route>
                      <Route>
                          <ChooseService/>
                      </Route>
                  </Switch>
              </div>
            </header>
          </div>
        </Router>
      </Elements>
    );
  }

}


export default App;
