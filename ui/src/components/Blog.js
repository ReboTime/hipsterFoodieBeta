import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import BlogPost from './blogComponents/BlogPost';
import Title from './blogComponents/Title';
import SearchBlog from './blogComponents/SearchBlog';

export default function Blog() {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [articles, setArticles] = useState([]);
	const [searchInput, setSearchInput] = useState('');

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

	function handleSearchInputChange(event) {
		setSearchInput(event.target.value);
		console.log('searchinput:', searchInput);
	}

	const searchTitle = (
		<Grid item xs={12}>
			<Typography>Search results for '{searchInput}'</Typography>
		</Grid>
	);

	let articlesToDisplay = articles;
	if (searchInput.length > 3)
		articlesToDisplay = articles.filter((article) => {
			if (JSON.stringify(article).match(searchInput) !== null) return true;
			return false;
		});

	return (
		<div>
			<SearchBlog handleSearchInputChange={handleSearchInputChange} />
			<Grid container spacing={3} align='center'>
				<Grid item xs={12}>
					<Title />
				</Grid>
                {searchInput.length > 3 ? searchTitle : <div></div>}
				{articlesToDisplay.map((article) => {
					if (article.published)
						return (
							<Grid item xs={12} md={6} lg={3} key={article.id}>
								<BlogPost article={article} />
							</Grid>
						);
					// EMPTY RETURN RESULTS IN ERROR. PLACING EMPTY DIV WITH UNPUBLISHED ARTICLE NAME
					return <div id={article.title} className='unpublished' key={article.id}></div>;
				})}
			</Grid>
		</div>
	);
}
