import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	box: {
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
		textShadow: '2px 2px 4px #889b43',
	},
}));

export default function Title() {
	const classes = useStyles();
	return (
		<Box className={classes.box}>
			<Typography variant='h3' color='initial' align='center' gutterBottom='true'>
				Hipster Foodie Beta
			</Typography>
			<Typography variant='subtitle2' color='initial'>
				Half webDev, half chef, 100% geek. You're welcome!
			</Typography>
		</Box>
	);
}
