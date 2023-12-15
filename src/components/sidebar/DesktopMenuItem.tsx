'use client';
import { cn } from '@/lib/utility';
import Link from 'next/link';
import { IconType } from 'react-icons';

type DesktopMenuItemProps = {
	label: string;
	icon: IconType;
	href: string;
	onClick?: () => void;
	active?: boolean;
};

export default function DesktopMenuItem({
	label,
	icon: Icon,
	href,
	onClick,
	active
}: DesktopMenuItemProps) {
	const handleClick = () => {
		if (onClick) {
			return onClick();
		}
	};
	return (
		<li onClick={handleClick}>
			<Link
				href={href}
				className={cn(
					'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100',
					active && 'bg-gray-100 text-black'
				)}
			>
				<Icon className={cn('w-6 h-6 shrink-0')} />
				<span className="sr-only">{label}</span>
			</Link>
		</li>
	);
}
