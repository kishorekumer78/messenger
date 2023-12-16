import { getCurrentUser } from '@/actions/getCurrentUser';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaDb';

export async function POST(request: NextRequest) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { message, image, conversationId } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized', data: null },
				{ status: 401 }
			);
		}

		const newMessage = await prisma.message.create({
			data: {
				body: message,
				image: image,
				conversation: {
					connect: {
						id: conversationId
					}
				},
				sender: {
					connect: {
						id: currentUser?.id
					}
				},
				seen: {
					connect: {
						id: currentUser?.id
					}
				}
			},
			include: {
				seen: true,
				sender: true
			}
		});
		//TODO: to use this for pusher
		const updatedConversation = await prisma.conversation.update({
			where: {
				id: conversationId
			},
			data: {
				lastMessageAt: new Date(),
				messages: {
					connect: {
						id: newMessage.id
					}
				}
			},
			include: {
				users: true,
				messages: {
					include: {
						seen: true
					}
				}
			}
		});

		return NextResponse.json(
			{ success: true, message: 'Message created', data: newMessage },
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: 'Internal server error', data: error.message },
			{ status: 500 }
		);
	}
}
