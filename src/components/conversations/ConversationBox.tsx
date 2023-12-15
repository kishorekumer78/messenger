'use client';
import { useOtherUser } from '@/hooks/useOtherUser';
import { cn } from '@/lib/utility';
import { FullConversationType } from '@/types';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import Avatar from '@/components/Avatar';
type ConversationBoxProps = {
	data: FullConversationType;
	selected?: boolean;
};

export default function ConversationBox({ data, selected }: ConversationBoxProps) {
	const otherUser = useOtherUser(data);
	const session = useSession();
	const router = useRouter();

	const handleClick = useCallback(() => {
		router.push(`/conversations/${data.id}`);
	}, [data.id, router]);

	const lastMessage = useMemo(() => {
		const messages = data.messages || [];
		return messages[messages.length - 1];
	}, [data.messages]);

	const userEmail = useMemo(() => {
		return session.data?.user?.email;
	}, [session.data?.user?.email]);

	const hasSeen = useMemo(() => {
		if (!lastMessage) {
			return false;
		}
		const seenArray = lastMessage.seen || [];

		if (!userEmail) {
			return false;
		}
		return seenArray.filter((user) => user.email === userEmail).length !== 0;
	}, [lastMessage, userEmail]);

	const lastMessageText = useMemo(() => {
		if (lastMessage?.image) {
			return 'Sent an image';
		}
		if (lastMessage?.body) {
			return lastMessage.body;
		}
		return 'Started a conversation';
	}, [lastMessage]);
	return (
		<>
			<div
				onClick={handleClick}
				className={cn(
					'w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer',
					selected && 'bg-neutral-100'
				)}
			>
				<Avatar user={otherUser} />
				<div className="min-w-0 flex-1">
					<div className="focus:outline-none">
						<div className="flex justify-between items-center mb-1">
							<p className="text-md font-semibold capitalize text-gray-900">
								{data.name || otherUser.name}
							</p>
							{lastMessage?.createdAt && (
								<p className="text-xs text-gray-400 font-light">
									{format(new Date(lastMessage.createdAt), 'p')}
								</p>
							)}
						</div>
						<p
							className={cn(
								'text-sm truncate',
								hasSeen ? 'text-gray-500' : 'text-black font-medium'
							)}
						>
							{lastMessageText}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
