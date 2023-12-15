import { getCurrentUser } from '@/actions/getCurrentUser';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaDb';

// create a new conversation or get existing
export async function POST(request: NextRequest) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { userId, isGroup, members, name } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized', data: null },
				{ status: 401 }
			);
		}

		if (isGroup && (!name || members.length < 2 || !name)) {
			return NextResponse.json(
				{ success: false, message: 'Invalid data', data: null },
				{ status: 400 }
			);
		}
		// incase of group chat
		if (isGroup) {
			const newConversation = await prisma.conversation.create({
				data: {
					name: name,
					isGroup: isGroup,
					users: {
						connect: [
							...members.map((member: { value: string }) => ({ id: member.value })),
							{
								// setting current user
								id: currentUser.id
							}
						]
					}
				},
				include: {
					users: true
				}
			});
			return NextResponse.json(
				{ success: true, message: 'Conversation created', data: newConversation },
				{ status: 200 }
			);
		}
		// for single chat if previous chat exists between two user
		const existingConversations = await prisma.conversation.findMany({
			where: {
				OR: [
					{
						userIds: {
							equals: [currentUser.id, userId]
						}
					},
					{
						userIds: {
							equals: [userId, currentUser.id]
						}
					}
				]
			}
		});
		const singleConversation = existingConversations[0];
		if (singleConversation) {
			return NextResponse.json(
				{ success: true, message: 'Conversation found', data: singleConversation },
				{ status: 200 }
			);
		}

		// if no previous chat exists
		const newConversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [
						{
							id: currentUser.id
						},
						{
							id: userId
						}
					]
				}
			},
			include: {
				users: true
			}
		});
		return NextResponse.json(
			{ success: true, message: 'Conversation created', data: newConversation },
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: 'Something went wrong', data: error.message },
			{ status: 500 }
		);
	}
}
