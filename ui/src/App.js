import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Blog from './components/Blog';

const theme = createMuiTheme({
  palette: {
		// primary: {
		// 	main: '#4ecc6f',
		// },
		// secondary: {
		// 	main: '#73deb0',
		// },
		background: {
			default: '#fff',

		},
	},
});
console.log(theme);
function App() {
	return (
		<Router>
			<div>
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
			</div>
		</Router>
	);
}

export default App;
