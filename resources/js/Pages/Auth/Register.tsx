import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/layouts/layout';
import { Link, useForm } from '@inertiajs/react';
import { PawPrint } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'owner',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <Layout title="Be the Part of FurShield">
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
                <Card className="w-full max-w-md rounded-2xl border border-border/50 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mb-4 flex justify-center">
                            <PawPrint className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="gradient-primary bg-clip-text text-2xl font-bold text-primary">Join FurShield Today</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                />
                                {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                            </div>

                            {/* Role */}
                            <div className="space-y-1">
                                <p className="mx-auto text-balance">
                                    Your by default role will be Pet Owner, You can request to be a Veterian on Profile Page
                                </p>
                            </div>

                            <div className="w-full space-y-1">
                                <Label htmlFor="role">Select Role</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose a role" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectItem value="owner">Owner</SelectItem>
                                        <SelectItem value="shelter">Shelter</SelectItem>
                                        <SelectItem value="vet">Vet</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="gradient-primary w-full from-primary to-secondary text-white hover:opacity-90"
                                disabled={processing}
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href={route('login')} className="font-medium text-primary hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
