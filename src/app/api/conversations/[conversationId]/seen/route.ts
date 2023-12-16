import { getCurrentUser } from '@/actions/getCurrentUser';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaDb';

type IParams = {
	conversationId: string;
};
export async function POST(request: NextRequest, { params }: { params: IParams }) {
	try {
		const currentUser = await getCurrentUser();
		const { conversationId } = params;

		if (!currentUser?.id || !currentUser?.email) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized', data: null },
				{ status: 401 }
			);
		}
		// find existing conversation
		const conversation = await prisma.conversation.findUnique({
			where: {
				id: conversationId
			},
			include: {
				messages: {
					include: {
						seen: true
					}
				},
				users: true
			}
		});

		if (!conversation) {
			return NextResponse.json(
				{ success: false, message: 'Conversation not found', data: null },
				{ status: 404 }
			);
		}
		// find the last message from the conversation
		const lastMessage = conversation.messages[conversation.messages.length - 1];
		if (!lastMessage) {
			return NextResponse.json(
				{ success: false, message: 'Last message not found', data: null },
				{ status: 200 }
			);
		}

		// update seen of last message
		if (!lastMessage.seenIds.includes(currentUser.id)) {
			const updatedMessage = await prisma.message.update({
				where: {
					id: lastMessage.id
				},
				data: {
					seen: {
						connect: {
							id: currentUser.id
						}
					}
				},
				include: {
					seen: true,
					sender: true
				}
			});

			return NextResponse.json(
				{ success: true, data: updatedMessage, message: 'Message seen successfully' },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ success: true, data: lastMessage, message: 'Message already seen' },
				{ status: 200 }
			);
		}
	} catch (error: any) {
		return NextResponse.json({
			success: false,
			message: 'Internal server error',
			data: error.message
		});
	}
}
