import bcrypt from 'bcrypt';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaDb';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, password } = body;

		if (!name || !email || !password) {
			return new NextResponse('Missing Info', { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				hashedPassword
			}
		});

		return NextResponse.json(
			{ success: true, message: 'Account created.', data: newUser },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message, data: null },
			{ status: 500 }
		);
	}
}
