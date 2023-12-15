import prisma from '@/lib/prismaDb';
import getSession from './getSession';
export const getUsers = async () => {
	const session = await getSession();

	if (!session?.user?.email) {
		return [];
	}

	try {
		// this query checks every for every input that is is current user or not so it is inefficient. we can get all the users and at the client end we can leave out the current user
		const users = await prisma.user.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				NOT: {
					email: session.user.email
				}
			}
		});

		return users;
	} catch (error: any) {
		return [];
	}
};
