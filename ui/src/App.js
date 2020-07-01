import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FPSStats from 'react-fps-stats';

import Blog from './components/Blog';
import Article from './components/Article';
import CMS from './components/CMS';

let theme = createMuiTheme({
	typography: {
		fontSize: 12,
		fontFamily: ['Ubuntu', 'Roboto', 'Arial', 'sans-serif'].join(','),
		subtitle2: {
			'@media (min-width:600px)': { fontSize: '.9rem' },
			'@media (min-width:960px)': { fontSize: '1rem' },
			'@media (min-width:1280px)': { fontSize: '1.3rem' },
		},
	},
	palette: {
		primary: {
			main: '#58661f',
		},
		secondary: {
			main: '#c9eec9',
		},
		background: {
			paper: '#fff',
		},
	},
	props: {
		extraPadding: {
			padding: '10px 8px 30px 20px',
		},
	},
	spacing: 4,
	overrides: {
		MuiCssBaseline: {
			'@global': {
				body: {
					background: 'linear-gradient(120deg, #bfe286 0%, #80d894 100%)',
					overflowX: 'hidden',
				},
			},
		},
		MuiButton: {
			root: {
				textTransform: 'none',
			}
		},
		MuiPaper: {
			rounded: {
				borderRadius: '4px',
				'@media (min-width:600px)': {
					borderRadius: '6px',
				},
				'@media (min-width:960px)': {
					borderRadius: '10px',
				},
			},
		},
		MuiCard: {
			root: {
				background: 'linear-gradient(120deg, #fff 0%, #f3fcd2 100%)',
				maxWidth: '95%',
				'@media (min-width:600px)': {
					padding: '2% 4%',
				},
				'@media (min-width:960px)': {
					padding: '3% 6%',
				},
			},
		},
		MuiSvgIcon: {
			root: {
				fontSize: '1.6rem',
			},
			fontSizeLarge: {
				fontSize: '2.3rem',
			},
		},
	},
});
theme = responsiveFontSizes(theme, { factor: 5 }); // only works on Typography h1-6
function App() {
	return (
		<Router>
			<div style={{minHeight: '100vh', position: 'relative'}}>
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
