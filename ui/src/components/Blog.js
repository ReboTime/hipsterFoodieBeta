import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Grid } from '@material-ui/core';
import BlogPost from './blogComponents/BlogPost';
import Title from './blogComponents/Title';
import CopyLinkSnackbar from './blogComponents/CopyLinkSnackbar';
import SearchBlog from './blogComponents/SearchBlog';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import GoUpButton from './blogComponents/GoUpButton';

export default function Blog() {
	const theme = useTheme();

	const loadArticlesNumber = 5;
	const threshold = 100;

	const [isLoadingMore, _setIsLoadingMore] = useState(false);
	const isLoadingMoreRef = useRef(isLoadingMore);
	const setIsLoadingMore = (data) => {
		isLoadingMoreRef.current = data;
		_setIsLoadingMore(data);
	};
	const [allArticles, setAllArticles] = useState([]);
	const [articles, setArticles] = useState([]);
	const [displayedArticles, setDisplayedArticles] = useState([]);
	const [lastIndex, setLastIndex] = useState(0);
	const [hasMore, _setHasMore] = useState(true);
	const hasMoreRef = useRef(hasMore);
	const setHasMore = (data) => {
		hasMoreRef.current = data;
		_setHasMore(data);
	};
	const [snackOpen, setSnackOpen] = useState(false);

	const containsValue = (article, value) => {
		return (
			article.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
			article.desc.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
			article.tldr.toLowerCase().indexOf(value.toLowerCase()) !== -1
		);
	};

	const handleSearchInputChange = (value) => {
		console.log('input search handle ', value);
		let filteredArticles;
		if (value.length > 3) {
			filteredArticles = allArticles.filter(
				(article) => article.published && containsValue(article, value),
			);
		} else {
			filteredArticles = [...allArticles];
		}
		setArticles(filteredArticles);
		setLastIndex(0);
		let index;
		if (filteredArticles.length <= loadArticlesNumber) {
			setHasMore(false);
			window.removeEventListener('scroll', scrollListenerInfinite);
			index = filteredArticles.length;
		} else {
			setHasMore(true);
			index = loadArticlesNumber;
			window.removeEventListener('scroll', scrollListenerInfinite);
			window.addEventListener('scroll', scrollListenerInfinite);
		}
		setDisplayedArticles(filteredArticles.splice(0, index));
	};

	const toggleSnackbar = () => {
		setSnackOpen(!snackOpen);
	};

	const scrollListenerInfinite = () => {
		if (isLoadingMoreRef.current) {
			console.log('still loading');
			return;
		}
		let body = document.body,
			html = document.documentElement;
		let height = Math.max(
			body.scrollHeight,
			body.offsetHeight,
			html.clientHeight,
			html.scrollHeight,
			html.offsetHeight,
		);

		if (window.pageYOffset + threshold + window.outerHeight > height) {
			if (hasMoreRef.current) {
				setIsLoadingMore(true);
			} else {
				window.removeEventListener('scroll', scrollListenerInfinite);
			}
		}
	};

	useEffect(() => {
		fetch('https://hipster-foodie-beta.s3.eu-west-1.amazonaws.com/articles.json')
			.then((res) => res.json())
			.then((result) => {
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
			});
		window.addEventListener('scroll', scrollListenerInfinite);
		return () => {
			window.removeEventListener('scroll', scrollListenerInfinite);
		};
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

	return (
		<>
			<Grid container spacing={4} align='center' justify='center'>
				<Grid item xs={12} md={9} lg={7}>
					<Title articles={articles} />
				</Grid>
				<SearchBlog handleSearchInputChange={handleSearchInputChange} />
				{/*Load displayed articles*/}
				{displayedArticles.map((article) => (
					<Grid item xs={12} md={9} lg={7} key={article.id}>
						<BlogPost article={article} toggleSnackbar={toggleSnackbar} />
					</Grid>
				))}
				{hasMore && (
					<Grid item xs={12} md={9} lg={7} key={0} style={{ minHeight: 100 }}>
						<CircularProgress size='50px' thickness={1} />
					</Grid>
				)}
			</Grid>
			<GoUpButton />
			<CopyLinkSnackbar open={snackOpen} toggleSnackbar={toggleSnackbar} />
			<AppBar
				color='secondary'
				style={{ position: 'relative', height: '30px', width: '100%', bottom: 0 }}
			/>
		</>
	);
}
