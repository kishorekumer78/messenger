'use client';

import { useOtherUser } from '@/hooks/useOtherUser';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { HiChevronLeft } from 'react-icons/hi2';
import Avatar from '../Avatar';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';

type HeaderPropType = {
	conversation: Conversation & {
		users: User[];
	};
};
export default function Header({ conversation }: HeaderPropType) {
	const otherUser = useOtherUser(conversation);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const statusText = useMemo(() => {
		if (conversation.isGroup) {
			return `${conversation.users.length} members`;
		}

		return 'Active';
	}, [conversation]);
	return (
		<>
			<ProfileDrawer
				data={conversation}
				isOpen={drawerOpen}
				onClose={() => setDrawerOpen(false)}
			/>
			<div className="bg-white w-full flex border-b border-slate-200 sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
				{/* left div */}
				<div className="flex gap-3 items-center">
					<Link
						href="/conversations"
						className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
					>
						<HiChevronLeft size={32} />
					</Link>
					<Avatar user={otherUser} />
					<div className="flex flex-col">
						<div className="">{conversation.name || otherUser?.name}</div>
						<div className="text-sm font-light text-neutral-500">{statusText}</div>
					</div>
				</div>
				{/* right 3 dot menu */}
				<HiEllipsisHorizontal
					size={32}
					onClick={() => setDrawerOpen(true)}
					className="text-sky-500 cursor-pointer hover:text-sky-600 transition hover:bg-gray-100 rounded-full"
				/>
			</div>
		</>
	);
}
