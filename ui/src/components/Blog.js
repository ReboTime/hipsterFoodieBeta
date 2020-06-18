import React, { useState, useEffect } from 'react';
import { Grid, Typography, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import BlogPost from './blogComponents/BlogPost';

export default function Blog() {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [articles, setArticles] = useState([]);

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
					console.log(result.articles);
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

	function handleClick(e) {
		e.preventDefault();
		console.log('The link was clicked.');
	}

	return (
		<div>
			<IconButton aria-label='' onClick={handleClick}>
				<SearchIcon fontSize='small' />
			</IconButton>
			<Grid container spacing={3} align='center'>
				<Grid item xs={12}>
					<Typography variant='h4' color='initial' align='center'>
						Hipster Foodie Beta
					</Typography>
				</Grid>
				{articles.map((article) => (
					<Grid item xs={12} key={article.id}>
						<BlogPost article={article}/>
					</Grid>
				))}
			</Grid>
		</div>
	);
}
