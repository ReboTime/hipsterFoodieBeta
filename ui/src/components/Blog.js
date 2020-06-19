import React, { useState, useEffect } from 'react';
import { Grid, Typography, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import BlogPost from './blogComponents/BlogPost';
import { makeStyles } from '@material-ui/core/styles';
import Title from './blogComponents/Title'


const useStyles = makeStyles((theme) => ({
    fixInCorner: {
        position: 'fixed',
        top: '10px',
        right: '10px'
    },
    typo: {
        paddingTop: '25px'
    }
}));

export default function Blog() {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState([]);
    
    const classes = useStyles();

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

	function handleClick(e) {
		e.preventDefault();
		console.log('The link was clicked.');
	}

	return (
		<div>
			<IconButton variant='outlined' onClick={handleClick} className={classes.fixInCorner} color='primary'>
				<SearchIcon fontSize='large' />
			</IconButton>
			<Grid container spacing={3} align='center'>
				<Grid item xs={12}>
                    <Title />
				</Grid>
				{articles.map((article) => (
					<Grid item xs={12} md={6} lg={3} key={article.id}>
						<BlogPost article={article}/>
					</Grid>
				))}
			</Grid>
		</div>
	);
}
