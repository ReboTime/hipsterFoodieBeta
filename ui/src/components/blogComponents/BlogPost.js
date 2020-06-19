import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	Collapse,
	Grid,
	IconButton,
	Link,
	Typography,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
// ICON IMPORTS
import FavoriteIcon from '@material-ui/icons/Favorite';
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';

import { Rating, Pagination } from '@material-ui/lab';
import SwipeableViews from 'react-swipeable-views';
import { FacebookShareButton } from 'react-share';
import RatingIcons from './RatingIcons';

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: '95%',
		background:
			'linear-gradient(49deg, rgba(241,250,149,0.5) 0%, rgba(255,246,217,0.5) 36%, rgba(255,255,255,1) 100%)',
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		// marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		backgroundColor: red[500],
	},
	pushToRight: {
		marginLeft: 'auto',
	},
	ul: {
		justifyContent: 'center',
	},
}));

export default function BlogPost(props) {
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);
	const [date, setDate] = useState();
	const [index, setIndex] = useState(0);
	const [googleLink, setGoogleLink] = useState('https://www.google.com/maps/search/');

	useEffect(() => {
		// FORMAT DATE FOR DISPLAY
		const date = new Date(props.article.date);
		const formattedDate =
			'Visited ' +
			date.getFullYear() +
			'-' +
			('0' + (date.getMonth() + 1)).slice(-2) +
			'-' +
			('0' + date.getDate()).slice(-2);

		setDate(formattedDate);
		// FORMAT GOOGLE LINK FOR MAP BUTTON
		setGoogleLink(
			`https://www.google.com/maps/search/?api=1&query=${props.article.location}&query_place_id=${props.article.googlePlaceId}`,
		);
	}, [props.article.date]);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

  const BLOG_URL='http://localhost:3000/';
	return (
		<Card className={classes.root} variant='elevation' elevation={10}>
			<CardHeader
				title={<Typography variant='h5'>{props.article.title}</Typography>}
				subheader={date}
			/>
			<SwipeableViews enableMouseEvents index={index}>
				{props.article.img.map((link, arrayIndex) => (
					<div key={arrayIndex}>
						<CardMedia className={classes.media} image={link} title='Paella dish' />
					</div>
				))}
			</SwipeableViews>
			<Pagination
				hideNextButton={true}
				hidePrevButton={true}
				variant='outlined'
				classes={{ ul: classes.ul }}
				count={props.article.img.length}
				onChange={(event, page) => setIndex(page - 1)}
				style={{ paddingTop: '10px', padding: '0px auto' }}
			/>
			<CardContent>
				<Grid container alignItems='center'>
					<Grid item xs={8}>
						<Typography
							variant='body2'
							align='justify'
							color='textSecondary'
							component='p'
							style={{ marginBottom: '10px' }}>
							TLDR: {props.article.tldr}
						</Typography>
					</Grid>
					{/* LINK TO GOOGLE MAPS */}
					<Grid item xs={2}>
						<Typography variant='body2' align='right' component='p'>
							See map:
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<IconButton component='a' href={googleLink} target='_blank'>
							<RoomTwoToneIcon fontSize='large' />
						</IconButton>
					</Grid>
					{/* RATINGS COMPONENT */}
					<RatingIcons ratings={props.article.ratings} />
				</Grid>
			</CardContent>

			<CardActions disableSpacing>
				{/* "SHARE ON" LINKS TO FACEBOOK, INSTAGRAM ETC */}
				<Typography variant='body2'>Share on</Typography>
        {/* !! TO DO  -> REMOVE BELOW TERNARY EXPRESSION FOR DEPLOYMENT AND CHANGE BLOG_URL TO PROPER VALUE */}
				<FacebookShareButton url={true ? 'http://www.google.com/' : BLOG_URL + '/' +  props.article.url}>
					<IconButton>
						<FacebookIcon />
					</IconButton>
				</FacebookShareButton>

				<IconButton aria-label='share'>
					<InstagramIcon />
				</IconButton>
				<Typography variant='body2' className={classes.pushToRight}>
					Read more:
				</Typography>
				<IconButton
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded,
					})}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label='show more'>
					<FavoriteIcon />
				</IconButton>
			</CardActions>
			<Collapse in={expanded} timeout='auto' unmountOnExit>
				<CardContent>
					<Typography paragraph>{props.article.desc}</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
