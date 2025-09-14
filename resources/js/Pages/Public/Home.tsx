import heroImage from '@/assets/hero-pets.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import Layout from '@/layouts/layout';
import { Link } from '@inertiajs/react';
import { Heart, Home as HomeIcon, Shield, ShoppingBag, Stethoscope } from 'lucide-react';

export default function Home() {
    return (
        <Layout title="Home">
            <section className="relative overflow-hidden">
                <div className="gradient-hero absolute inset-0 opacity-10" />
                <div className="container px-4 py-20">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                                    Complete Pet Care
                                    <span className="gradient-primary block bg-clip-text text-transparent">Management</span>
                                </h1>
                                <p className="max-w-md text-xl text-muted-foreground">
                                    Connect pet owners, veterinarians, and shelters in one comprehensive platform for better pet care.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link href={route('register')}>
                                    <Button size="lg" className="gradient-primary shadow-glow rhover:opacity-90 text-white">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button size="lg" variant="outline">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 pt-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">10K+</div>
                                    <div className="text-sm text-muted-foreground">Happy Pets</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">500+</div>
                                    <div className="text-sm text-muted-foreground">Veterinarians</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">100+</div>
                                    <div className="text-sm text-muted-foreground">Shelters</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <img src={heroImage} alt="Happy pets with their owners" className="h-auto w-full rounded-2xl shadow-2xl" />
                            <div className="shadow-glow absolute inset-0 rounded-2xl opacity-30" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-muted/30 py-20">
                <div className="container px-4">
                    <div className="mb-16 space-y-4 text-center">
                        <h2 className="text-3xl font-bold md:text-4xl">Everything You Need for Pet Care</h2>
                        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                            Whether you're a pet owner, veterinarian, or shelter, FurShield provides the tools you need.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-soft hover:shadow-glow border-0 transition-all duration-300">
                            <CardContent className="space-y-4 p-6 text-center">
                                <div className="gradient-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold">Pet Profiles</h3>
                                <p className="text-muted-foreground">
                                    Create detailed profiles for all your pets with photos, health records, and care history.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-soft hover:shadow-glow border-0 transition-all duration-300">
                            <CardContent className="space-y-4 p-6 text-center">
                                <div className="gradient-secondary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                                    <Stethoscope className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold">Vet Management</h3>
                                <p className="text-muted-foreground">Book appointments, track treatments, and manage medical records seamlessly.</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-soft hover:shadow-glow border-0 transition-all duration-300">
                            <CardContent className="space-y-4 p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                                    <HomeIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold">Pet Adoption</h3>
                                <p className="text-muted-foreground">Connect with shelters to find your perfect companion or help pets find homes.</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-soft hover:shadow-glow border-0 transition-all duration-300">
                            <CardContent className="space-y-4 p-6 text-center">
                                <div className="bg-success mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                                    <ShoppingBag className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold">Pet Products</h3>
                                <p className="text-muted-foreground">Browse and discover the best products for your pet's health and happiness.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container px-4">
                    <div className="space-y-8 text-center">
                        <h2 className="text-3xl font-bold md:text-4xl">Join the FurShield Community Today</h2>
                        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                            Start managing your pet's health and connecting with the best veterinary care in your area.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href={route('register')}>
                                <Button size="lg" className="gradient-primary shadow-glow text-white hover:opacity-90">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Start Protecting Your Pets
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
