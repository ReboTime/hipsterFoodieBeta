import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from './blogComponents/Title';
import BlogPost from './blogComponents/BlogPost';
import { Button, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CopyLinkSnackbar from './blogComponents/CopyLinkSnackbar'


const useStyles = makeStyles((theme) => ({
	extraPadding: {
		padding: theme.spacing(3),
	},
}));

export default function Article() {
	const classes = useStyles();
	// We can use the `useParams` hook here to access
	// the dynamic pieces of the URL.
	let { url } = useParams();
	const [article, setArticle] = useState();
	const [snackOpen, setSnackOpen] = useState(false);

	function toggleSnackbar() {
		setSnackOpen(!snackOpen);
	}

	useEffect(() => {
		fetch('https://hipster-foodie-beta.s3.eu-west-1.amazonaws.com/articles.json')
			.then((res) => res.json())
			.then(
				(result) => {
					setArticle(result.articles.find((post) => post.url === url));
				},
			);
	}, [url]);
	let blogpost = article ? (
		<BlogPost article={article} toggleSnackbar={toggleSnackbar}/>
	) : (
		<div>Article not found, check your link yo!</div>
	);
	return (
		<div className={classes.extraPadding}>
			<Grid container spacing={3} align='center'>
				<Grid item xs={12}>
					<Title />
				</Grid>
				<Grid item xs={12}>
					{blogpost}
				</Grid>
				<Grid item xs={12}>
					<Button variant='contained'>
						<Link href='/'>GO HOME!</Link>
					</Button>
				</Grid>
			</Grid>
			<CopyLinkSnackbar open={snackOpen} toggleSnackbar={toggleSnackbar} />
		</div>
	);
}
