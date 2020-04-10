import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import '../styles/App.css';
import ListAllLinks from './ListAllLinks';
import CreateLink from './CreateLink';
import Header from './Header';
import Login from './Login';
import Search from './Srearch';

function App() {
  return (
    <div className="App">
      {/* <ListAllLinks />
      <CreateLink /> */}
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path='/' render={() => <Redirect to='/new/1' />} />
            {/* <Route exact path="/" component={ListAllLinks} /> */}
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/search" component={Search} />
            <Route exact path='/top' component={ListAllLinks} />
            <Route exact path='/new/:page' component={ListAllLinks} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
