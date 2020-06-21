import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import BlogPost from './blogComponents/BlogPost';
import Title from './blogComponents/Title';
import CopyLinkSnackbar from './blogComponents/CopyLinkSnackbar'
import SearchBlog from './blogComponents/SearchBlog';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	extraPadding: {
		padding: theme.spacing(3),
	},
}));

export default function Blog() {
	const classes = useStyles();

	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [articles, setArticles] = useState([]);
	const [searchInput, setSearchInput] = useState('');
	const [snackOpen, setSnackOpen] = useState(false);

	function handleSearchInputChange(value) {
		setSearchInput(value);
	}

	function toggleSnackbar() {
		setSnackOpen(!snackOpen);
	}

	// Note: the empty deps array [] means
	// this useEffect will run once
	// similar to componentDidMount()
	useEffect(() => {
		fetch('/articles.json')
			.then((res) => res.json())
			.then(
				(result) => {
					setIsLoaded(true);
					setArticles(result.articles);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					setIsLoaded(true);
					setError(error);
				},
			);
	}, []);

	const searchTitle = (
		<Grid item xs={12}>
			<Typography>
				Search results for '{searchInput}'
				<IconButton
					onClick={() => {
						handleSearchInputChange('');
					}}>
					<CloseIcon fontSize='small' />
				</IconButton>
			</Typography>
		</Grid>
	);

	let articlesToDisplay = articles;
	if (searchInput.length > 3) {
		articlesToDisplay = articles.filter((article) => {
			if (JSON.stringify(article).toLowerCase().match(searchInput.toLowerCase()) !== null)
				return true;
			return false;
		});
	}
	return (
		<div className={classes.extraPadding}>
			<SearchBlog
				searchInput={searchInput}
				handleSearchInputChange={handleSearchInputChange}
			/>
			<Grid container spacing={3} align='center'>
				<Grid item xs={12}>
					<Title />
				</Grid>
				{searchInput.length > 3 ? searchTitle : <div></div>}
				{articlesToDisplay
					.filter((article) => (article.published ? true : false))
					.sort((a, b) => b.date.localeCompare(a.date))
					.map((article) => {
						return (
							<Grid item xs={12} md={6} lg={3} key={article.id}>
								<BlogPost article={article} toggleSnackbar={toggleSnackbar}/>
							</Grid>
						);
					})}
			</Grid>
			<CopyLinkSnackbar open={snackOpen} toggleSnackbar={toggleSnackbar} />
		</div>
	);
}
