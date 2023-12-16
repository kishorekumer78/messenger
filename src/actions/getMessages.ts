import prisma from '@/lib/prismaDb';

export const getMessages = async (conversationId: string) => {
	try {
		const messages = await prisma.message.findMany({
			where: { conversationId: conversationId },
			include: {
				sender: true,
				seen: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		});
		return messages;
	} catch (error: any) {
		return [];
	}
};
