'use client';
import { cn } from '@/lib/utility';
import Link from 'next/link';
import { IconType } from 'react-icons';

type MobileMenuItemProps = {
	icon: IconType;
	href: string;
	onClick?: () => void;
	active?: boolean;
};

export default function MobileMenuItem({ icon: Icon, href, onClick, active }: MobileMenuItemProps) {
	const handleClick = () => {
		if (onClick) {
			return onClick();
		}
	};
	return (
		<>
			<Link
				href={href}
				onClick={handleClick}
				className={cn(
					'group flex gap-x-3  text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100',
					active && 'bg-gray-100 text-black'
				)}
			>
				<Icon className="w-6 h-6" />
			</Link>
		</>
	);
}
