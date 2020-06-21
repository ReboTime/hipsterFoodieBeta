import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import BlogPost from './blogComponents/BlogPost';
import Title from './blogComponents/Title';
import CopyLinkSnackbar from './blogComponents/CopyLinkSnackbar';
import SearchBlog from './blogComponents/SearchBlog';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';


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
	const [displayedArticles, setDisplayedArticles] = useState([]);
	const [lastIndex, setLastIndex] = useState(0);
	const [hasMore, setHasMore] = useState(true);
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
		fetch('https://hipster-foodie-beta.s3.eu-west-1.amazonaws.com/articles.json')
			.then((res) => res.json())
			.then(
				(result) => {
					setIsLoaded(true);

					const filteredArticles = result.articles
						.filter((article) => article.published)
						.sort((a, b) => b.date.localeCompare(a.date));
					console.log('articles array after fetch and filter: ',filteredArticles);
					if (filteredArticles.length <= 5) {
						setLastIndex(filteredArticles.length);
						setDisplayedArticles(filteredArticles);
						setHasMore(false);
					} else {
						setLastIndex(5);
						setDisplayedArticles(filteredArticles.slice(0,5));
					}
					setArticles(filteredArticles);
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

	function loadArticles() {
		console.log('loading 5 more');
		let index = lastIndex + 5;
		if (index >= articles.length) {
			index = articles.length;
			setHasMore(false);
		}
		setDisplayedArticles(articles.slice(0, index));
		setLastIndex(index);
	}

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

	if (searchInput.length > 3) {
		setDisplayedArticles(
			displayedArticles.filter((article) => {
				if (JSON.stringify(article).toLowerCase().match(searchInput.toLowerCase()) !== null)
					return true;
				return false;
			}),
		);
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
				<InfiniteScroll
					loadMore={loadArticles}
					hasMore={hasMore}
					loader={
						<div className='loader' key={0}>
							Loading ...
						</div>
					}>
					{displayedArticles.map((article) => {
						return (
							<Grid item xs={12} md={6} lg={3} key={article.id}>
								<BlogPost article={article} toggleSnackbar={toggleSnackbar} />
							</Grid>
						);
					})}
				</InfiniteScroll>
			</Grid>
			<CopyLinkSnackbar open={snackOpen} toggleSnackbar={toggleSnackbar} />
		</div>
	);
}
