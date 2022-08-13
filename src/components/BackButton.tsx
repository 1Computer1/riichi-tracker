import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import CircleButton from './CircleButton';

export default function BackButton({ children }: { children?: ReactNode }) {
	const navigate = useNavigate();
	return (
		<CircleButton
			onClick={() => {
				navigate(-1);
			}}
		>
			{children}
		</CircleButton>
	);
}
