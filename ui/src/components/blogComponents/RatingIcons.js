import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import LocalBarIcon from '@material-ui/icons/LocalBar';

const useStyles = makeStyles(() => ({
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
}));

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
		name: 'food',
		component: <RestaurantMenuIcon />,
	},
	{
		name: 'drinks',
		component: <LocalBarIcon />,
	},
];

export default function RatingIcons(props) {
    const classes = useStyles();
    const [ratings, setRatings] = useState(props.ratings);

    useEffect(() => {
    	setRatings(props.ratings);
	}, [props.ratings])

	function updateRating(icon, value) {
		props.updateRating(icon, value);
	}
	return (
		<Grid item xs={12} alignItems='center' justify='center' container>
			{ratingIcons.map((icon) => (
				<Grid item xs={6} md={3} key={icon.name}>
					<Rating
						data-icon={icon.name}
						classes={{ iconFilled: classes[icon.name] }}
						name={icon.name}
						max={5}
						readOnly={props.readOnly}
						value={ratings[icon.name]}
						onChange={event => updateRating(event.currentTarget.name, +event.currentTarget.value)}
						precision={0.5}
						icon={icon.component}
					/>
				</Grid>
			))}
		</Grid>
	);
}
