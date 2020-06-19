import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	typography: {
		paddingTop: '25px',
	},
}));

export default function Title() {
	const classes = useStyles();
	return (
		<Typography variant='h4' color='initial' align='center' className={classes.typography}>
			Hipster Foodie Beta
		</Typography>
	);
}
