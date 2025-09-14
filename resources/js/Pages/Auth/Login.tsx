import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import AuthLayout from '@/Layouts/auth-layout';
import Layout from '@/layouts/layout';
import { PawPrint } from 'lucide-react';
import { useSonner } from 'sonner';

type UserRole = 'owner' | 'veterinarian' | 'shelter';

const Login = () => {
    const [role, setRole] = useState<UserRole>('owner');
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, reset } = useForm({
        email: '',
        password: '',
        role: role,
    });

    const { toasts } = useSonner();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('login'), {
            onSuccess: () => {
                // toasts({
                //     title: 'Welcome back!',
                //     description: 'You have successfully logged in.',
                // });
                reset('password'); // optional: clear password field
            },
            onError: () => {
                // toast({
                //     title: 'Login failed',
                //     description: 'Invalid credentials. Please try again.',
                //     variant: 'destructive',
                // });
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <Layout title="Login">
            <AuthLayout title="Log in to your account" description="Access your dashboard and manage your ISP from a single place.">
                <Card className="shadow-glow w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mb-4 flex justify-center">
                            <PawPrint className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="gradient-primary bg-clip-text text-2xl font-bold text-transparent">Welcome Back to FurShield</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <Button type="submit" className="gradient-primary w-full text-white hover:opacity-90" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <Link href={route('register')} className="text-primary hover:underline">
                                    Sign up here
                                </Link>
                            </p>
                        </div>

                        {/* <div className="mt-4 rounded-lg bg-muted/30 p-4">
                            <p className="mb-2 text-xs text-muted-foreground">Demo accounts:</p>
                            <div className="space-y-1 text-xs">
                                <div>Owner: john@example.com</div>
                                <div>Vet: drsmith@vetclinic.com</div>
                                <div>Shelter: info@happypaws.org</div>
                                <div className="mt-1 font-medium">Password: any</div>
                            </div>
                        </div> */}
                    </CardContent>
                </Card>
            </AuthLayout>
        </Layout>
    );
};

export default Login;
