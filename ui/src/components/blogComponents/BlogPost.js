import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Collapse,
	Grid,
	IconButton,
	Typography,
} from '@material-ui/core';
// ICON IMPORTS
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';
import { FacebookIcon, FacebookShareButton } from 'react-share';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyTwoTone';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';
import RatingIcons from './RatingIcons';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import './BlogPost.css';

const useStyles = makeStyles((theme) => ({
	articleTitle: {
		[theme.breakpoints.up('md')]: {
			padding: '0 17%',
		},
	},
	share: {
		margin: '0 0 0 3%',
	},
	facebookButton: {
		display: 'flex',
		margin: '0px 6px',
	},
	readMore: {
		marginLeft: 'auto',
	},
	mapBox: {
		float: 'right',
		display: 'flex',
		alignItems: 'center',
		justify: 'center',
		marginLeft: '5%',
	},
	mapButton: {
		padding: '0',
		border: '2px solid',
		borderRadius: '4px',
		margin: '0 4px',
		background: theme.palette.secondary.main,
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
}));

export default function BlogPost(props) {
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);
	const formattedUrl = window.location.origin + '/post/' + props.article.url;

	// FORMAT DATE FOR DISPLAY
	function formatDate() {
		const date = new Date(props.article.date);
		return `from ${date.toDateString()}`;
	}

	// FORMAT GOOGLE LINK FOR MAP BUTTON
	function formatGoogleLink() {
		return `https://www.google.com/maps/search/?api=1&query=${props.article.location}&query_place_id=${props.article.googlePlaceId}`;
	}

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleCopyLinkClick = () => {
		const el = document.createElement('textarea');
		el.value = formattedUrl;
		document.body.appendChild(el);
		el.select();
		el.setSelectionRange(0, 99999); /*For mobile devices*/
		document.execCommand('copy');
		document.body.removeChild(el);
		props.toggleSnackbar();
	};

	return (
		<Card variant='elevation' elevation={10}>
			<CardHeader
				title={
					<Typography variant='h5' className={classes.articleTitle}>
						{props.article.title}
					</Typography>
				}
				subheader={formatDate()}
			/>
			{/* IMAGE CAROUSEL */}
			<AwesomeSlider bullets={false}>
				{props.article.img.length > 0 ? (
					props.article.img.map((link, arrayIndex) => (
						<div key={arrayIndex} data-src={link} />
					))
				) : (
					<div data-src='https://www.bucurestiivechisinoi.ro/wp-content/uploads/2019/03/code-matrix.jpg' />
				)}
			</AwesomeSlider>
			<CardContent className={classes.cardContent}>
				<Grid container justify='space-between' alignItems='center' spacing={3}>
					<Grid item xs={12}>
						{/* LINK TO GOOGLE MAPS */}
						<Box className={classes.mapBox}>
							<Typography variant='body2' align='right' component='span'>
								See map:
							</Typography>
							<IconButton
								component='a'
								className={classes.mapButton}
								href={formatGoogleLink()}
								target='_blank'>
								<RoomTwoToneIcon fontSize='large' />
							</IconButton>
						</Box>
						<Typography
							variant='subtitle2'
							align='justify'
							color='textSecondary'
							component='p'
							style={{ marginBottom: '10px' }}>
							TLDR: {props.article.tldr}
						</Typography>
					</Grid>
					{/* RATINGS COMPONENT */}
					<Grid item xs={12}>
						<RatingIcons ratings={props.article.ratings} readOnly={true} />
					</Grid>
				</Grid>
			</CardContent>

			<CardActions disableSpacing>
				{/* "SHARE ON" LINKS TO FACEBOOK, OR COPY TEXT TO CLIPBOARD */}
				<Typography variant='body2' className={classes.share}>
					Share
				</Typography>
				<FacebookShareButton className={classes.facebookButton} url={formattedUrl}>
					<FacebookIcon size={25} borderRadius={8} />
				</FacebookShareButton>
				<Typography variant='body2'>Copy link</Typography>
				<IconButton onClick={handleCopyLinkClick}>
					<FileCopyTwoToneIcon />
				</IconButton>
				<Typography variant='body2' className={classes.readMore}>
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
					<div
						style={{ textAlign: 'left' }}
						dangerouslySetInnerHTML={{ __html: props.article.desc }}
					/>
				</CardContent>
			</Collapse>
		</Card>
	);
}
