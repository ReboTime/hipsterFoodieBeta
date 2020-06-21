import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Blog from './components/Blog';
import Article from './components/Article';
import CMS from './components/CMS';

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
	spacing: 4,
});
console.log(theme);
function App() {
	return (
		<Router>
			<div>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Switch>
						<Route path='/cms'>
							<CMS />
						</Route>
						<Route path='/post/:url'>
							<Article />
						</Route>
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
