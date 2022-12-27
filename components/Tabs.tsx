import { Box } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

export default function Tabs() {
	const CheckInIcon = () => {
		return (
			<svg width='50' height='50' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path
					d='M25 0C11.193 0 0 11.193 0 25s11.193 25 25 25 25-11.193 25-25S38.807 0 25 0zm0 38.349c-1.352-1.061-10.59-8.53-10.59-16.398 0-5.84 4.687-10.58 10.504-10.673v-.004l.086.002.086-.002v.004c5.817.092 10.504 4.833 10.504 10.673 0 7.868-9.238 15.338-10.59 16.398z'
					fill='#14AEDE'
				/>
				<path
					d='M30.597 21.033a5.51 5.51 0 11-11.021 0 5.51 5.51 0 0111.02 0z'
					fill='#14AEDE'
				/>
			</svg>
		);
	};

	const LifelogIcon = () => {
		return (
			<svg width='50' height='50' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<circle cx='25' cy='25' r='25' fill='#DE471F' fillOpacity='.5' />
				<path
					d='M16.516 31.618H33.43a6.645 6.645 0 000-13.29H16.516a6.646 6.646 0 000 13.29zm0-9.666H33.43a3.02 3.02 0 110 6.041H16.516a3.02 3.02 0 110-6.04zM9.87 9.87h30.206v3.625H9.87V9.871zM9.87 36.45h30.206v3.626H9.87V36.45z'
					fill='#fff'
				/>
			</svg>
		);
	};

	const OptionsIcon = () => {
		return (
			<svg width='50' height='50' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path
					d='M25 50c6.678 0 12.956-2.6 17.678-7.322A24.837 24.837 0 0050 25c0-6.677-2.6-12.956-7.322-17.678C37.956 2.6 31.678 0 25 0 18.322 0 12.044 2.6 7.322 7.322A24.837 24.837 0 000 25c0 6.677 2.6 12.956 7.322 17.678C12.044 47.4 18.322 50 25 50zm14.044-39.045a.684.684 0 11.969-.968c8.279 8.279 8.279 21.749 0 30.028a.683.683 0 01-.97 0 .685.685 0 010-.968c7.746-7.745 7.745-20.347.001-28.092zM13.618 13.62c6.275-6.276 16.487-6.276 22.762 0a.684.684 0 11-.968.969c-5.742-5.742-15.085-5.742-20.826 0a.685.685 0 11-.969-.969zm18.161 4.601a.685.685 0 11.969-.968A10.886 10.886 0 0135.958 25c0 2.926-1.14 5.679-3.21 7.748a.683.683 0 01-.97 0 .684.684 0 010-.968 9.525 9.525 0 002.81-6.78c0-2.562-.998-4.97-2.809-6.78zM29.11 25c0 1.098-.428 2.13-1.205 2.907A4.082 4.082 0 0125 29.11a4.083 4.083 0 01-2.906-1.203 4.084 4.084 0 01-1.204-2.906c0-1.098.428-2.13 1.204-2.906a4.082 4.082 0 012.906-1.204c1.097 0 2.13.428 2.905 1.203a4.084 4.084 0 011.204 2.907zm-10.89 6.781a.685.685 0 11-.97.969A10.888 10.888 0 0114.04 25c0-2.926 1.14-5.678 3.21-7.748a.684.684 0 11.97.968 9.526 9.526 0 00-2.81 6.781c0 2.561.998 4.969 2.81 6.78zm-4.602 3.632a.684.684 0 01.969 0c5.742 5.742 15.084 5.742 20.825 0a.685.685 0 11.969.969 16.043 16.043 0 01-11.382 4.707 16.045 16.045 0 01-11.381-4.707.685.685 0 010-.969zM9.985 9.986a.685.685 0 11.969.969c-7.744 7.745-7.744 20.346 0 28.09a.685.685 0 11-.97.97c-8.278-8.28-8.278-21.75.001-30.029z'
					fill='#DEAD2A'
					fillOpacity='.5'
				/>
				<path
					d='M23.062 23.063A2.72 2.72 0 0022.26 25c0 .732.285 1.42.803 1.937 1.035 1.035 2.84 1.035 3.874 0A2.722 2.722 0 0027.74 25c0-.732-.285-1.42-.803-1.937a2.72 2.72 0 00-1.937-.802 2.72 2.72 0 00-1.937.802z'
					fill='#DEAD2A'
					fillOpacity='.5'
				/>
			</svg>
		);
	};

	const TabLinks = [
		{
			name: 'LifeLog',
			icon: <LifelogIcon />,
			link: '/lifelog',
		},
		{
			name: 'CheckIn',
			icon: <CheckInIcon />,
			link: '/checkin',
		},
		{
			name: 'Options',
			icon: <OptionsIcon />,
			link: '/options',
		},
	];

	return (
		<div className='w-full'>
			<section className='block fixed inset-x-0 bottom-0 z-10 bg-white shadow p-2'>
				<div className='flex justify-around'>
					{TabLinks.map((tab, index) => {
						// if (tab.link === '/checkin') {
						// 	return <Box onClick={CheckIn}>{tab.icon}</Box>;
						// }
						return (
							<a href={tab.link} key={index}>
								{tab.icon}
							</a>
						);
					})}
				</div>
			</section>
		</div>
	);
}
