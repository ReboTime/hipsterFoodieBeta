import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from './blogComponents/Title';
import BlogPost from './blogComponents/BlogPost';
import { Button, Typography } from '@material-ui/core';
// import { Link } from 'react-router-dom';
import Link from '@material-ui/core/Link';

export default function Article() {
	// We can use the `useParams` hook here to access
	// the dynamic pieces of the URL.
	let { url } = useParams();
	const [article, setArticle] = useState();
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		fetch('/articles.json')
			.then((res) => res.json())
			.then(
				(result) => {
					setIsLoaded(true);
					setArticle(result.articles.find((post) => post.url === url));
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					setIsLoaded(true);
					setError(error);
				},
			);
	});
	let blogpost = article ? <BlogPost article={article} /> : '';
	return (
		<div>
			<Title />
			{blogpost}
			<Button variant='contained'>
				<Link href='/'>GO HOME!</Link>
			</Button>
		</div>
	);
}
