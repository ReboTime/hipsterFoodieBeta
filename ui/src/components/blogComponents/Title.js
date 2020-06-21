import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	typography: {
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
	},
}));

export default function Title() {
	const classes = useStyles();
	return (
		<Typography variant='h3' color='initial' align='center' className={classes.typography}>
			Hipster Foodie Beta
		</Typography>
	);
}
