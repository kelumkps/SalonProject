import React from 'react';
import { Navbar} from 'react-bootstrap'
import {LoadingIndicator} from './components/LoadingIndicator';
import {AppNotificationComponent} from './components/AppNotificationComponent';
import {ChooseService} from './components/ChooseService';

class App extends React.Component {
  render() {
    return (
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
            <ChooseService/>
          </div>
        </header>
      </div>
    );
  }

}


export default App;
