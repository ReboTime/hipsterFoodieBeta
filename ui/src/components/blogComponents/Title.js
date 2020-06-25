import React, { useState } from 'react';
import { Button, ButtonGroup, Card, Modal, Slide, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	titleCard: {
		[theme.breakpoints.up('xs')]: {
			paddingTop: '20px',
			paddingBottom: '20px',
		},
		[theme.breakpoints.up('md')]: {
			paddingTop: '40px',
		},
		[theme.breakpoints.up('xl')]: {
			paddingTop: '60px',
		},
		textShadow: '0.5px 0.5px 0px #889b43',
		marginBottom: '10px',
	},
	descriptionCard: {
		[theme.breakpoints.up('xs')]: {
			paddingTop: '20px',
			paddingBottom: '20px',
		},
		[theme.breakpoints.up('md')]: {
			paddingBottom: '30px',
		},
		[theme.breakpoints.up('xl')]: {
			paddingBottom: '50px',
		},
	},
	modalCard: {
		position: 'absolute',
		top: '50%',
		transform: 'translateY(-50%)',
		left: '50%',
		transform: 'translateX(-50%)',
		'&:focus': {
			outline: 'none',
		},
	},
	removeFocus: {
		'&:focus': {
			outline: 'none',
		},
	},
}));

export default function Title() {
	const classes = useStyles();
	const description =
		'while (awake) { if (hungry) then { function findDeliciousFood(){ if (happy) then foundIt = true } if (foundIt == true) return blogPost; }';

	const [modalIsOpen, setModalIsOpen] = useState(false);

	function closeModal() {
		setModalIsOpen(false);
	}

	return (
		<>
			<Card variant='elevation' elevation={10} className={classes.titleCard}>
				<Typography variant='h3' color='initial' align='center' gutterBottom={true}>
					Hipster Foodie Beta
				</Typography>
				<Typography variant='subtitle2' color='initial'>
					Half webDev, half chef, 100% geek. You're welcome!
				</Typography>
			</Card>
			<Card variant='elevation' elevation={10} className={classes.descriptionCard}>
				<Typography variant='subtitle2' align='justify' gutterBottom='true'>
					{description}
				</Typography>
				<ButtonGroup color='primary' aria-label='outlined primary button group'>
					<Button onClick={() => setModalIsOpen(!modalIsOpen)}>{'<About />'}</Button>
					<Button onClick={() => setModalIsOpen(!modalIsOpen)}>
						{'<SocialMedia />'}
					</Button>
					<Button onClick={() => setModalIsOpen(!modalIsOpen)}>
						{'<RandomArticle />'}
					</Button>
				</ButtonGroup>
			</Card>
			<Modal open={modalIsOpen} onClose={() => setModalIsOpen(!modalIsOpen)}>
				<Card variant='elevation' elevation={10} className={classes.modalCard}>
					some modal content
				</Card>
			</Modal>
		</>
	);
}
