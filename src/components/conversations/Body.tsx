'use client';

import { useConversation } from '@/hooks/useConversation';
import { FullMessageType } from '@/types';
import { useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox';
import axios from 'axios';

type BodyProps = {
	initialMessages: FullMessageType[];
};

export default function Body({ initialMessages }: BodyProps) {
	const [messages, setMessages] = useState(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);

	const { conversationId } = useConversation();
	useEffect(() => {
		axios.post(`/api/conversations/${conversationId}/seen`);
	}, [conversationId]);

	return (
		<>
			<div className="flex-1 overflow-y-auto">
				{messages.map((message, i) => (
					<MessageBox
						key={message.id}
						data={message}
						isLast={i === messages.length - 1}
					/>
				))}
				<div ref={bottomRef} className="t-24" />
			</div>
		</>
	);
}
