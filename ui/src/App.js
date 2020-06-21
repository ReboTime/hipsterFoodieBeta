import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Blog from './components/Blog';
import Article from './components/Article';
import CMS from './components/CMS';

let theme = createMuiTheme({
	typography: {
		fontSize: 12,
	},
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
	overrides: {
		// Style sheet name ⚛
		MuiCard: {
		  // Name of the rule
		  root: {
			background: 'linear-gradient(49deg, rgba(241,250,149,0.5) 0%, rgba(255,246,217,0.5) 36%, rgba(255,255,255,1) 100%)',
			maxWidth: "95%",
		  },
		  text: {
			// Some CSS
			color: 'white',
		  },
		},
	  },
});
theme = responsiveFontSizes(theme, { factor: 5 }); // only works on Typography h1-6
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
