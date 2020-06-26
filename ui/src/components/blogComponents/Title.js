import React, { useState, useRef, useEffect } from 'react';
import {
	Button,
	ButtonGroup,
	Card,
	IconButton,
	Modal,
	Typography,
	CardMedia,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';

import { ReactComponent as TitleSvg } from './titleSvg.svg';
import './Title.css';

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
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'&:focus': {
			outline: 'none',
		},
	},
	modalCard: {
		width: '90%',
		'&:focus': {
			outline: 'none',
		},
	},
}));

export default function Title(props) {
	const classes = useStyles();
	const description =
		'while (awake) { if (hungry) then { function findDeliciousFood(){ if (happy) then foundIt = true } if (foundIt == true) return blogPost; }';

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalContent, setModalContent] = useState();

	const svgRef = useRef(null);

	useEffect(()=>{
		console.log(svgRef);
		console.log(svgRef.current.childNodes);
		const svg = svgRef.current.childNodes;
		let offset = 0;
		for (let i=0; i<svg.length; i++) {
		  const lineLength = svg[i].getTotalLength();
		  svg[i].setAttribute('style', `stroke-dasharray: ${lineLength}; stroke-dashoffset: ${lineLength}; animation: line-anim 4s ease forwards ${offset}s;`);
		  offset += 1;
		}
		svgRef.current.setAttribute('style', `animation: fillIt 2s ease forwards ${offset+3}s;`)
	},[]);

	function openModal(event) {
		setModalContent(event.currentTarget.value);
		setModalIsOpen(true);
	}
	function renderModal(content) {
		switch (content) {
			case 'about':
				return (
					<>
						<CardMedia
							image='images/bigPanSmallPic.jpg'
							style={{ height: '300px' }}></CardMedia>
						<Typography>some stuff about me</Typography>
					</>
				);
			case 'media':
				return (
					<>
						<IconButton
							href='https://www.facebook.com/Hipster-Foodie-Beta-102325544868819'
							target='_blank'>
							<FacebookIcon fontsize='large' />
						</IconButton>
						<IconButton
							href='https://www.facebook.com/Hipster-Foodie-Beta-102325544868819'
							target='_blank'>
							<TwitterIcon fontsize='large' />
						</IconButton>
						<IconButton
							href='https://www.facebook.com/Hipster-Foodie-Beta-102325544868819'
							target='_blank'>
							<InstagramIcon fontsize='large' />
						</IconButton>
					</>
				);
			case 'article':
				return 'article content';
			default:
				return 'whoops... default content';
		}
	}

	function closeModal() {
		setModalIsOpen(false);
	}

	function getArticle() {
		const articles = props.articles;
		console.log(articles[Math.floor(Math.random() * articles.length)].url);
		const url = `http://localhost:3000/post/${
			articles[Math.floor(Math.random() * articles.length)].url
		}`;
		// change to deployment link when ready
		// const url =`http://https://hipster-foodie-beta.herokuapp.com/post/${articles[Math.floor(Math.random() * articles.length)].url}`;
		window.open(url, '_blank');
	}

	return (
		<>
			<Card variant='elevation' elevation={10} className={classes.titleCard}>
				<TitleSvg ref={svgRef} />
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
					<Button value='about' onClick={openModal}>
						{'<About />'}
					</Button>
					<Button value='media' onClick={openModal}>
						{'<SocialMedia />'}
					</Button>
					<Button value='article' onClick={getArticle} target='_blank'>
						{'<RandomArticle />'}
					</Button>
				</ButtonGroup>
			</Card>
			<Modal open={modalIsOpen} onClose={closeModal} className={classes.modal}>
				<Card variant='elevation' elevation={10} className={classes.modalCard}>
					{renderModal(modalContent)}
				</Card>
			</Modal>
		</>
	);
}
