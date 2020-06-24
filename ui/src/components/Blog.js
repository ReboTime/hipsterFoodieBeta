import React, {useState, useEffect, useRef} from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import BlogPost from './blogComponents/BlogPost';
import Title from './blogComponents/Title';
import CopyLinkSnackbar from './blogComponents/CopyLinkSnackbar';
import SearchBlog from './blogComponents/SearchBlog';
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigationIcon from '@material-ui/icons/Navigation';

export default function Blog() {
	const theme = useTheme();

	const loadArticlesNumber = 5;
	const threshold = 100;
	const [goUp, _setGoUp] = useState(false);
	const goUpRef = useRef(goUp);
	const setGoUp = data => {
		goUpRef.current = data;
		_setGoUp(data);
	}
	const [isLoadingMore, _setIsLoadingMore] = useState(false);
	const isLoadingMoreRef = useRef(isLoadingMore);
	const setIsLoadingMore = data => {
		isLoadingMoreRef.current = data;
		_setIsLoadingMore(data);
	}
	const [allArticles, setAllArticles] = useState([]);
	const [articles, setArticles] = useState([]);
	const [displayedArticles, setDisplayedArticles] = useState([]);
	const [lastIndex, setLastIndex] = useState(0);
	const [hasMore, _setHasMore] = useState(true);
	const hasMoreRef = useRef(hasMore);
	const setHasMore = data => {
		hasMoreRef.current = data;
		_setHasMore(data);
	}
	const [searchInput, setSearchInput] = useState('');
	const [snackOpen, setSnackOpen] = useState(false);

	const containsValue = (article, value) => {
		return (
			article.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
			article.desc.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
			article.tldr.toLowerCase().indexOf(value.toLowerCase()) !== -1
		);
	}

	const handleSearchInputChange = value => {
		console.log("input search handle")
		if (value.length > 3) {
			let searchArticles = allArticles.filter(
				(article) => article.published && containsValue(article, value),
			);
			setArticles(searchArticles);
			let displayArticles = [...searchArticles];
			setDisplayedArticles(
				displayArticles.splice(0, searchArticles.length > loadArticlesNumber ? loadArticlesNumber : searchArticles.length),
			);
		} else {
			if (value.length === 0 || value.length === 3) {
				setArticles(allArticles);
				setLastIndex(0);
				setHasMore(true);
			}
		}
		setSearchInput(value);
	}

	const toggleSnackbar = () => {
		setSnackOpen(!snackOpen);
	}

	const scrollListener = () => {
		console.log(window.pageYOffset, goUpRef.current);
		if (window.pageYOffset > 160 && !goUpRef.current) {
			setGoUp(true);
		}
		if (window.pageYOffset <= 160 && goUpRef.current) {
			setGoUp(false);
		}
		if (isLoadingMoreRef.current) {
			console.log("still loading");
			return;
		}
		let body = document.body,
			html = document.documentElement;
		let height = Math.max( body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight );

		if (window.pageYOffset + threshold + window.outerHeight > height) {
			if (hasMoreRef.current) {
				setIsLoadingMore(true);
			} else {
				console.log("remove listener");
				window.removeEventListener('scroll', scrollListener);
			}
		}
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
					if (filteredArticles.length <= loadArticlesNumber) {
						setLastIndex(filteredArticles.length);
						setDisplayedArticles(filteredArticles);
						setHasMore(false);
					} else {
						setLastIndex(loadArticlesNumber);
						setDisplayedArticles(filteredArticles.slice(0, loadArticlesNumber));
					}
					setArticles(filteredArticles);
					setAllArticles(filteredArticles);
				}
			);
		window.addEventListener('scroll', scrollListener);
		return () => {
			window.removeEventListener('scroll', scrollListener);
		}
	}, []);

	useEffect(() => {
		if (!isLoadingMore) {
			return;
		}
		console.log('loading 5 more');
		//setTimeout( () => {
			let index = lastIndex + loadArticlesNumber;
			console.log(articles.length);
			if (index >= articles.length) {
				index = articles.length;
				setHasMore(false);
			}
			setDisplayedArticles(displayedArticles.concat(articles.slice(lastIndex, index)));
			setLastIndex(index);
			setIsLoadingMore(false);
		//}, 1000);
	}, [isLoadingMore]);

	const searchTitle = (
		<Grid item xs={12} md={9} lg={7}>
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
				{searchInput.length > 3 && searchTitle}
				<Grid item container justify='center' xs={12} md={9} lg={7} spacing={3}>
					{/*Load displayed articles*/}
					{displayedArticles.map((article) =>
						<Grid item xs={12} key={article.id}>
							<BlogPost article={article} toggleSnackbar={toggleSnackbar} />
						</Grid>
					)}
					{hasMore && <Grid item xs={12} md={9} lg={7} key={0} style={{ minHeight: 100 }}>
						<CircularProgress size='50px' thickness={1} />
					</Grid>}
				</Grid>
			</Grid>
			{goUp && <IconButton
						onClick={() => window.scrollTo(0, 0)}
						style={{zIndex: 5, float: 'right', bottom: 20, position: 'sticky' }}>
					<NavigationIcon />
				</IconButton>}
			<CopyLinkSnackbar open={snackOpen} toggleSnackbar={toggleSnackbar} />
		</div>
	);
}
