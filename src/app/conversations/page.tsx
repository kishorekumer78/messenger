'use client';
import { cn } from '@/lib/utility';
import { useConversation } from '@/hooks/useConversation';
import EmptyState from '@/components/EmptyState';

export default function ConversationPage() {
	const { isOpen } = useConversation();
	return (
		<div className={cn('hidden lg:block lg:pl-80 h-full', isOpen ? 'block' : 'hidden')}>
			<EmptyState />
		</div>
	);
}
