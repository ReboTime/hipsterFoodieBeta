import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Grid, IconButton, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
// ICON IMPORTS
import LocalBarIcon from '@material-ui/icons/LocalBar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';

import { Rating, Pagination } from '@material-ui/lab';
import SwipeableViews from 'react-swipeable-views';

const useStyles = makeStyles((theme) => ({
	star: {
		color: '#fcec03',
	},
	price: {
		color: '#18b800',
	},
	drinks: {
		color: '#00b87e',
	},
	food: {
		color: '#d44700',
	},
	root: {
    maxWidth: '95%',
    background: 'linear-gradient(49deg, rgba(241,250,149,0.5) 0%, rgba(255,246,217,0.5) 36%, rgba(255,255,255,1) 100%)',
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

	useEffect(() => {
		const date = new Date(props.article.date);
		const formattedDate =
			'Visited ' +
			date.getFullYear() +
			'-' +
			('0' + (date.getMonth() + 1)).slice(-2) +
			'-' +
			('0' + date.getDate()).slice(-2);

		setDate(formattedDate);
	}, [props.article.date]);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const ratingIcons = [
		{
			name: 'star',
			component: <StarBorderIcon />,
		},
		{
			name: 'price',
			component: <MonetizationOnOutlinedIcon />,
		},
		{
			name: 'drinks',
			component: <RestaurantMenuIcon />,
		},
		{
			name: 'food',
			component: <LocalBarIcon />,
		},
	];

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
              onChange={(event, page) => setIndex(page-1) }
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
					<Grid item xs={2}>
						<Typography variant='body2' align='right' component='p'>
							See map:
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<IconButton aria-label='add to favorites'>
							<RoomTwoToneIcon fontSize='large' />
						</IconButton>
					</Grid>
					{ratingIcons.map((icon) => (
						<Grid item xs={6} md={3} key={icon.name}>
							<Rating
								classes={{ iconFilled: classes[icon.name] }}
								name='stars'
								max={5}
								readOnly={true}
								defaultValue={props.article.ratings[icon.name]}
								precision={0.5}
								icon={icon.component}
							/>
						</Grid>
					))}
				</Grid>
			</CardContent>

			<CardActions disableSpacing>
				<Typography variant='body2'>Share on</Typography>
				<IconButton aria-label='add to favorites'>
					<FavoriteIcon />
				</IconButton>
				<IconButton aria-label='share'>
					<ShareIcon />
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
