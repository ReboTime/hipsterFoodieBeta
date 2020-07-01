import React from 'react';
import { Box, Typography } from '@material-ui/core';
import theme from '@material-ui/core/styles'

const Footer = () => {
	return (
		<Box
			color='secondary'
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				position: 'absolute',
				height: '30px',
				width: '100%',
				bottom: 0,
			}}>
			<Typography variant='subtitle2' color='primary' style={{ paddingLeft: '10px' }}>
				Thanks for visiting.
			</Typography>
			<Typography variant='subtitle2' color='primary' style={{ paddingRight: '10px' }}>
				&copy;BoBrothers 2020
			</Typography>
		</Box>
	);
};

export default Footer;
