import React from 'react';
import '../styles/App.css';
import ListAllLinks from './ListAllLinks';
import CreateLink from './CreateLink';

function App() {
  return (
    <div className="App">
      <ListAllLinks />
      <CreateLink />
    </div>
  );
}

export default App;
