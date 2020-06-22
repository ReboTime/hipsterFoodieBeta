import React from 'react';
import { Card, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	titleCard: {
		[theme.breakpoints.up('xs')]: {
			paddingTop: '20px',
			paddingBottom: '20px',
		},
		[theme.breakpoints.up('md')]: {
			paddingTop: '40px',
			paddingBottom: '30px',
		},
		[theme.breakpoints.up('xl')]: {
			paddingTop: '60px',
			paddingBottom: '50px',
		},
		textShadow: '1px 1px 4px #889b43',
	},
}));

export default function Title() {
	const classes = useStyles();
	return (
		<Card variant='elevation' elevation={10} className={classes.titleCard}>
				<Typography variant='h3' color='initial' align='center' gutterBottom={true}>
					Hipster Foodie Beta
				</Typography>
				<Typography variant='subtitle2' color='initial'>
					Half webDev, half chef, 100% geek. You're welcome!
				</Typography>
		</Card>
	);
}
