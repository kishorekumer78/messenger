'use client';

import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';

import Input from '@/components/inputs/Input';
import Button from '@/components/Button';
import AuthSocialButton from '@/components/auth/AuthSocialButton';
import { useRouter } from 'next/navigation';

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
	const session = useSession();
	const router = useRouter();
	const [variant, setVariant] = useState<Variant>('LOGIN');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (session?.status === 'authenticated') {
			router.push('/users');
		}
	}, [session?.status, router]);

	const toggleVariant = () => {
		if (variant === 'LOGIN') {
			setVariant('REGISTER');
		} else {
			setVariant('LOGIN');
		}
	};
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	});
	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		if (variant === 'REGISTER') {
			setIsLoading(true);
			axios
				.post('/api/register', data)
				.then((res) => {
					toast.success('Register success');
					signIn('credentials', data);
				})
				.catch((err) => toast.error(err.message))
				.finally(() => {
					setIsLoading(false);
				});
		}

		if (variant === 'LOGIN') {
			// next auth SignIn
			signIn('credentials', {
				...data,
				redirect: false
			})
				.then((cb) => {
					if (cb?.error) {
						toast.error(cb.error);
					}
					if (cb?.ok && !cb?.error) {
						toast.success('Log in success');
						router.push('/users');
					}
				})
				.finally(() => setIsLoading(false));
		}
	};

	const socialAction = (action: string) => {
		setIsLoading(true);
		// Next auth social sign in
		signIn(action, { redirect: false })
			.then((cb) => {
				if (cb?.error) {
					toast.error(cb.error);
				}
				if (cb?.ok && !cb?.error) {
					toast.success('Log in success');
				}
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<>
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
						{variant === 'REGISTER' && (
							<Input
								label="Name"
								id="name"
								type="text"
								register={register}
								errors={errors}
								disabled={isLoading}
							/>
						)}
						<Input
							label="Email"
							id="email"
							type="email"
							register={register}
							errors={errors}
							disabled={isLoading}
						/>
						<Input
							label="Password"
							id="password"
							type="password"
							register={register}
							errors={errors}
							disabled={isLoading}
						/>
						<div className="">
							<Button disabled={isLoading} fullWidth type="submit">
								{variant === 'LOGIN' ? 'Sign In' : 'Register'}
							</Button>
						</div>
					</form>
					{/* social login corner */}
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">
									Or continue with
								</span>
							</div>
						</div>
						{/* auth social button */}
						<div className="mt-6 flex gap-2">
							<AuthSocialButton
								icon={BsGithub}
								onClick={() => socialAction('github')}
							/>
							<AuthSocialButton
								icon={BsGoogle}
								onClick={() => socialAction('google')}
							/>
						</div>
					</div>

					{/* register or login  */}
					<div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
						<div className="">
							{variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
						</div>
						<div className="underline cursor-pointer" onClick={toggleVariant}>
							{variant === 'LOGIN' ? 'Create an account' : 'Login'}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
