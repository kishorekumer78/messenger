import { getConversationById } from '@/actions/getConversationById';
import { getMessages } from '@/actions/getMessages';
import EmptyState from '@/components/EmptyState';
import Body from '@/components/conversations/Body';
import Header from '@/components/conversations/Header';
import MessageForm from '@/components/conversations/MessageForm';

type IParams = {
	conversationId: string;
};
export default async function ConversationIdPage({ params }: { params: IParams }) {
	const conversation = await getConversationById(params.conversationId);
	const messages = await getMessages(params.conversationId);

	if (!conversation) {
		return (
			<div className="lg:pl-80 h-full">
				<div className="h-full flex flex-col">
					<EmptyState />
				</div>
			</div>
		);
	}
	return (
		<>
			<div className="lg:pl-80 h-full">
				<div className="h-full flex flex-col">
					{/* // conversation header */}
					<Header conversation={conversation} />
					{/* conversation body  */}
					<Body initialMessages={messages} />
					{/* conversation message form */}
					<MessageForm />
				</div>
			</div>
		</>
	);
}
