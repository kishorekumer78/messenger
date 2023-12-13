'use client';
import { cn } from '@/lib/utility';
type ButtonProps = {
	type?: 'submit' | 'reset' | 'button' | undefined;
	fullWidth?: boolean;
	children?: React.ReactNode;
	onClick?: () => void;
	secondary?: boolean;
	danger?: boolean;
	disabled?: boolean;
};

export default function Button({
	type,
	fullWidth,
	children,
	onClick,
	secondary,
	danger,
	disabled
}: ButtonProps) {
	return (
		<>
			<button
				onClick={onClick}
				type={type}
				disabled={disabled}
				className={cn(
					'flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600',
					disabled && 'opacity-50 cursor-default',
					fullWidth && 'w-full',
					secondary ? 'text-gray-900' : 'text-white',
					danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600'
				)}
			>
				{children}
			</button>
		</>
	);
}
