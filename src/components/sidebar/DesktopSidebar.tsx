'use client';

import { useRoutes } from '@/hooks/useRoutes';
import { useState } from 'react';
import DesktopMenuItem from './DesktopMenuItem';
import { User } from '@prisma/client';
import Avatar from '@/components/Avatar';
type DesktopSidebarProps = {
	currentUser: User | null;
};

export default function DesktopSidebar({ currentUser }: DesktopSidebarProps) {
	const routes = useRoutes();
	const [isOpen, setIsOpen] = useState(false); // TODO

	return (
		<>
			<div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
				<nav className="mt-4 flex flex-col justify-between">
					<ul role="list" className="flex flex-col items-center space-y-1">
						{routes.map((item, i) => (
							<DesktopMenuItem
								key={i}
								href={item.href}
								label={item.label}
								icon={item.icon}
								active={item.active}
								onClick={item.onClick}
							/>
						))}
					</ul>
				</nav>
				<nav className="mt-4 flex flex-col justify-between items-center">
					<div
						className="cursor-pointer hover:opacity-75 transition"
						onClick={() => setIsOpen(true)}
					>
						<Avatar user={currentUser} />
					</div>
				</nav>
			</div>
		</>
	);
}
