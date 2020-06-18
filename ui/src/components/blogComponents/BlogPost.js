import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Grid, MobileStepper } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
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
}));

export default function BlogPost(props) {
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);
	const [date, setDate] = useState();

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
	});

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	console.log(props.article.title);

	return (
		<Card className={classes.root}>
			<CardHeader
				// TODO - as putea pune un icon cu furculitza si cutit
				// avatar={
				// 	<Avatar aria-label='recipe' className={classes.avatar}>
				// 		Ravil
				// 	</Avatar>
				// }

				title={<Typography variant='h5'>{props.article.title}</Typography>}
				subheader={date}
			/>
			<CardMedia
				className={classes.media}
				image='/static/images/cards/paella.jpg'
				title='Paella dish'
			/>
			<CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
							TLDR: {props.article.tldr}
						</Typography>
				<Grid container>
					<Grid item xs={6}>
          <Rating
          name="customized-empty"
          defaultValue={2}
          precision={0.5}
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
        />
					</Grid>
          <Grid item xs={6}>
					</Grid>
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
