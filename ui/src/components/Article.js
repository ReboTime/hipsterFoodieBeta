import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from './blogComponents/Title';
import BlogPost from './blogComponents/BlogPost';
import Footer from './blogComponents/Footer';
import { Button, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CopyLinkSnackbar from './blogComponents/CopyLinkSnackbar';

const useStyles = makeStyles((theme) => ({
	extraPadding: {
		padding: theme.spacing(3),
		paddingBottom: '30px'
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
		fetch('https://hipster-foodie-beta.s3.eu-west-1.amazonaws.com/articles.json?' + Date.now())
			.then((res) => res.json())
			.then((result) => {
				setArticle(result.articles.find((post) => post.url === url));
			});
	}, [url]);
	let blogpost = article ? (
		<BlogPost article={article} toggleSnackbar={toggleSnackbar} />
	) : (
		<div>Article not found, check your link yo!</div>
	);
	return (
		<>
			<Grid container direction='column' alignItems='center' className={classes.extraPadding}>
				<Grid item xs={12} md={9} xl={7} container spacing={3} align='center'>
					<Grid item xs={12}>
						<Title />
					</Grid>
					<Grid item xs={12}>
						{blogpost}
					</Grid>
					<Grid item xs={12}>
						<Button variant='contained' color='secondary' style={{padding: '20px 0', width: '95%'}} href='/'>
							Click me to visit the entire blog!
						</Button>
					</Grid>
				</Grid>
			</Grid>
			<CopyLinkSnackbar open={snackOpen} toggleSnackbar={toggleSnackbar} />
			<Footer style={{position: 'absolute'}}/>
		</>
	);
}
