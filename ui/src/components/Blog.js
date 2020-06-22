import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import BlogPost from './blogComponents/BlogPost';
import Title from './blogComponents/Title';
import CopyLinkSnackbar from './blogComponents/CopyLinkSnackbar';
import SearchBlog from './blogComponents/SearchBlog';
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollToTop from 'react-scroll-up';
import NavigationIcon from '@material-ui/icons/Navigation';

export default function Blog() {
	const theme = useTheme();

	const [isLoaded, setIsLoaded] = useState(false);
	const [allArticles, setAllArticles] = useState([]);
	const [articles, setArticles] = useState([]);
	const [displayedArticles, setDisplayedArticles] = useState([]);
	const [lastIndex, setLastIndex] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [searchInput, setSearchInput] = useState('');
	const [snackOpen, setSnackOpen] = useState(false);

	function handleSearchInputChange(value) {
		if (value.length > 3) {
			let searchArticles = allArticles.filter(
				(article) => article.published && containsValue(article, value),
			);
			setArticles(searchArticles);
			let displayArticles = [...searchArticles];
			setDisplayedArticles(
				displayArticles.splice(0, searchArticles.length > 5 ? 5 : searchArticles.length),
			);
			setLastIndex(0);
			setHasMore(searchArticles.length > 5);
		} else {
			if (value.length === 0 || value.length === 3) {
				setArticles(allArticles);
				setLastIndex(0);
				setHasMore(true);
			}
		}
		setSearchInput(value);
	}

	function containsValue(article, value) {
		return (
			article.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
			article.desc.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
			article.tldr.toLowerCase().indexOf(value.toLowerCase()) !== -1
		);
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
					const filteredArticles = result.articles
						.filter((article) => article.published)
						.sort((a, b) => b.date.localeCompare(a.date));
					console.log('articles array after fetch and filter: ', filteredArticles);
					if (filteredArticles.length <= 5) {
						setLastIndex(filteredArticles.length);
						setDisplayedArticles(filteredArticles);
						setHasMore(false);
					} else {
						setLastIndex(5);
						setDisplayedArticles(filteredArticles.slice(0, 5));
					}
					setArticles(filteredArticles);
					setAllArticles(filteredArticles);
					setIsLoaded(true);
				}
			).catch(() => setIsLoaded(true));
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

	return (
		<div style={theme.props.extraPadding}>
			<SearchBlog
				searchInput={searchInput}
				handleSearchInputChange={handleSearchInputChange}
			/>
			<Grid container spacing={4} align='center'>
				<Grid item xs={12} container spacing={3} justify='center'>
					<Grid item xs={12} md={9} lg={7}>
						
							<Title />
					</Grid>
				</Grid>
				{searchInput.length > 3 ? searchTitle : <div />}
				<InfiniteScroll
					element={Grid}
					item
					xs={12}
					container
					justify='center'
					spacing={3}
					threshold={1000}
					initialLoad={isLoaded}
					loadMore={loadArticles}
					hasMore={hasMore}
					loader={
						<Grid item xs={12} key={0}>
							<CircularProgress size='50px' thickness={1} />
						</Grid>
					}>
					{displayedArticles.map((article) => {
						return (
							<Grid item xs={12} md={9} lg={7} key={article.id}>
								<BlogPost article={article} toggleSnackbar={toggleSnackbar} />
							</Grid>
						);
					})}
				</InfiniteScroll>
			</Grid>
			<ScrollToTop showUnder={160} style={{zIndex: 5, bottom: 20, right: 28}}>
				<IconButton>
					<NavigationIcon />
				</IconButton>
			</ScrollToTop>
			<CopyLinkSnackbar open={snackOpen} toggleSnackbar={toggleSnackbar} />
		</div>
	);
}
