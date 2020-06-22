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
		fontFamily: ['Ubuntu', 'Roboto', 'Arial', 'sans-serif'].join(','),
		subtitle2: {
			'@media (min-width:600px)': {fontSize: ".9rem"},
			'@media (min-width:9600px)': {fontSize: "1rem"},
			'@media (min-width:1280px)': {fontSize: "1.3rem"}
		}
	},
	palette: {
		primary: {
			main: '#58661f',
		},
		background: {
			paper: '#fff',
		},
	},
	spacing: 4,
	overrides: {
		MuiCssBaseline: {
			'@global': {
				body: {
					background: 'linear-gradient(120deg, #ebffb3 0%, #e1ffe2 100%)',
				},
			},
		},
		// Style sheet name
		MuiCard: {
			// Name of the rule
			root: {
				background: 'linear-gradient(120deg, #f3fcd2 0%, #eeeeff 100%)',
				maxWidth: '95%',
			},
			text: {
				// Some CSS
				color: 'white',
			},
		},
	},
});
theme = responsiveFontSizes(theme, { factor: 5 }); // only works on Typography h1-6
// theme.typography.subtitle2 = {
// 	[theme.breakpoints.up('md')]: { fontSize: '2.4rem' },
// };
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
