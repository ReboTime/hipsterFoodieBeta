import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Blog from './components/Blog';

function App() {
	return (
		<Router>
			<div>
				<Switch>
					{/* <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route> */}
					<Route exact path='/'>
						<Blog />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
