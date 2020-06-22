import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import {
	Modal,
	Slide,
	Paper,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
	makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
	fixInCorner: {
		position: 'fixed',
		top: '0',
		right: '24px',
		
		'@media (min-width:600px)': {
			padding: '0',
			position: 'fixed',
			top: '16px',
			right: '48px',
		},
		'@media (min-width:960px)': {
			position: 'fixed',
			padding: '8px',
			top: '30px',
			right: '50px',
			background: 'rgba( 100, 100, 100, 0.1)',
		},
	},
	searchPaper: {
		'@media (min-width:600px)': {
			paddingTop: '20px',
			paddingBottom: '10px',
		},
		'@media (min-width:960px)': {
			paddingTop: '30px',
			paddingBottom: '30px',
		},
		opacity: '0.9',
	},
}));

export default function SearchBlog(props) {
	const classes = useStyles();

	const [searchOpen, setSearchOpen] = useState(false);

	function handleKeyDown(e) {
		if (e.keyCode === 13) toggleDrawer();
	}

	function toggleDrawer() {
		setSearchOpen(!searchOpen);
	}

	if (!searchOpen) {
		return (
			<IconButton
				variant='outlined'
				onClick={toggleDrawer}
				className={classes.fixInCorner}
				color='primary'>
				<SearchIcon fontSize='large' />
			</IconButton>
		);
	}

	return (
		<div>
			<Modal open={searchOpen} onClose={() => setSearchOpen(!searchOpen)}>
				<Slide in={searchOpen} timeout={700} direction={'down'}>
					<Paper className={classes.searchPaper}>
						<Grid container justify='center'>
							<Grid item xs={10}>
								<Typography variant='h4' color='initial'>
									hope you find what you're looking for
								</Typography>
								<Typography variant='subtitle2' color='initial'>
									if not, well... i still have a lot of places to try
								</Typography>
							</Grid>
							<Grid item xs={10}>
								<TextField
									label='Search for:'
									variant='outlined'
									size='small'
									fullWidth={true}
									autoFocus={true}
									value={props.searchInput}
									onChange={(e) => {
										props.handleSearchInputChange(e.target.value);
									}}
									onKeyDown={handleKeyDown}
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													onClick={() => {
														props.handleSearchInputChange('');
													}}>
													<CloseIcon fontSize='small' />
												</IconButton>
											</InputAdornment>
										),
									}}
									style={{ marginBottom: 10, marginTop: 10 }}
								/>
							</Grid>
						</Grid>
					</Paper>
				</Slide>
			</Modal>
		</div>
	);
}
