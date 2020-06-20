import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Collapse,
	Grid,
	IconButton,
	Typography,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
// ICON IMPORTS
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';
// import FacebookIcon from '@material-ui/icons/Facebook';
import { FacebookIcon } from 'react-share';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyTwoTone';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';

import { FacebookShareButton } from 'react-share';
import RatingIcons from './RatingIcons';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

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
	facebookButton: {
		display: 'flex',
		margin: '0px 6px',
	},
	carouselDiv: {
		width: '100%',
		paddingTop: '50%',
		overflow: 'hidden',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
}));

export default function BlogPost(props) {
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);
	const [date, setDate] = useState();
	const [index, setIndex] = useState(0);
	const [googleLink, setGoogleLink] = useState('https://www.google.com/maps/search/');

	const BLOG_URL = 'http://localhost:3000';
	const formattedUrl = `${BLOG_URL}/${props.article.url}`;

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

	const handleCopyLinkClick = (e) => {
		const el = document.createElement('textarea');
		el.value = formattedUrl;
		document.body.appendChild(el);
		el.select();
		el.setSelectionRange(0, 99999); /*For mobile devices*/
		document.execCommand('copy');
		document.body.removeChild(el);
	};

  console.log('img type:', typeof props.article.img)
	return (
		<Card className={classes.root} variant='elevation' elevation={10}>
			<CardHeader
				title={<Typography variant='h5'>{props.article.title}</Typography>}
				subheader={date}
			/>
			{/* IMAGE CAROUSEL */}
			<Carousel showStatus={false} infiniteLoop={true} showThumbs={false} showArrows={false}>
				{props.article.img.length > 0 ? (
					props.article.img.map((link, arrayIndex) => (
						<div key={arrayIndex}>
							<img src={link} />
						</div>
					))
				) : (
					<div>
						<img src='https://www.bucurestiivechisinoi.ro/wp-content/uploads/2019/03/code-matrix.jpg' />
					</div>
				)}
			</Carousel>
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
					<RatingIcons ratings={props.article.ratings} readOnly={true} />
				</Grid>
			</CardContent>

			<CardActions disableSpacing>
				{/* "SHARE ON" LINKS TO FACEBOOK, OR COPY TEXT TO CLIPBOARD */}
				<Typography variant='body2'>Share</Typography>
				{/* !! TO DO  -> REMOVE BELOW TERNARY EXPRESSION FOR DEPLOYMENT AND CHANGE BLOG_URL TO PROPER VALUE */}
				<FacebookShareButton
					className={classes.facebookButton}
					url={true ? 'http://www.google.com/' : formattedUrl}>
					<FacebookIcon size={25} borderRadius={8} />
				</FacebookShareButton>
				<Typography variant='body2'>Copy link</Typography>
				<IconButton onClick={handleCopyLinkClick}>
					<FileCopyTwoToneIcon />
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
					<ExpandMoreTwoToneIcon />
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
