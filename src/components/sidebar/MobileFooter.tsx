'use client';

import { useConversation } from '@/hooks/useConversation';
import { useRoutes } from '@/hooks/useRoutes';
import MobileMenuItem from './MobileMenuItem';

type Props = {};

export default function MobileFooter({}: Props) {
	const routes = useRoutes();
	const { isOpen } = useConversation();
	if (isOpen) {
		return null;
	}
	return (
		<>
			<div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] px-4  lg:hidden">
				{routes.map((route, i) => (
					<MobileMenuItem
						key={i}
						href={route.href}
						icon={route.icon}
						active={route.active}
						onClick={route.onClick}
					/>
				))}
			</div>
		</>
	);
}
