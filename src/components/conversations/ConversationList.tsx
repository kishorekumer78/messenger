'use client';
import { useState } from 'react';
import { FullConversationType } from '@/types';
import { useRouter } from 'next/navigation';
import { useConversation } from '@/hooks/useConversation';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { cn } from '@/lib/utility';
import ConversationBox from './ConversationBox';

type ConversationListProps = {
	initialItems: FullConversationType[];
};

export default function ConversationList({ initialItems }: ConversationListProps) {
	const [items, setItems] = useState(initialItems);
	const router = useRouter();
	const { conversationId, isOpen } = useConversation();
	return (
		<>
			<aside
				className={cn(
					'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 ',
					isOpen ? 'hidden' : 'w-full block left-0'
				)}
			>
				<div className="px-5">
					<div className="flex justify-between mb-4 pt-4">
						<div className="text-2xl font-bold text-neutral-800">Messages</div>
						<div className="rounded-full p-2 bg-gray-100 cursor-pointer hover:opacity-75 transition">
							<MdOutlineGroupAdd size={20} />
						</div>
					</div>
					{items.map((item, i) => (
						<ConversationBox
							key={i}
							data={item}
							selected={conversationId === item.id}
						/>
					))}
				</div>
			</aside>
		</>
	);
}
