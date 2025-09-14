import Layout from '@/layouts/layout';

export default function AboutUsPage() {
    return (
        <Layout title="About Page">
            <div className="flex min-h-screen flex-col items-center bg-background py-16 text-foreground">
                <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <section className="mx-auto mb-12 max-w-4xl text-center">
                        <h1 className="mb-6 text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                            Our Story: Every Paw/Wing Deserves a Shield of Love
                        </h1>
                        <p className="text-base font-light text-muted-foreground sm:text-lg md:text-xl">
                            Welcome to FurShield, where we believe that every pet deserves a shield of love and the best possible care. We've built a
                            platform to empower pet owners, veterinarians, and animal shelters to connect and thrive.
                        </p>
                    </section>

                    {/* Problem & Solution */}
                    <section className="mb-12 grid gap-8 md:grid-cols-2">
                        <article className="transform rounded-2xl bg-card p-6 shadow-sm transition-transform duration-300 hover:scale-102">
                            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">The Problem We Saw</h2>
                            <p className="leading-relaxed text-muted-foreground">
                                Managing a pet's life can be challenging. From vaccination schedules and medical records to finding a new home for a
                                shelter animal, information is often scattered and difficult to manage. This can lead to missed appointments,
                                inconsistent care, and a disconnect between the people who care most about our animal friends.
                            </p>
                        </article>

                        <article className="transform rounded-2xl bg-card p-6 shadow-sm transition-transform duration-300 hover:scale-102">
                            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">Our Unified Solution</h2>
                            <p className="leading-relaxed text-muted-foreground">
                                FurShield brings all pet care activities under one roof. Our platform allows pet owners to manage their pet's health,
                                vets to record treatment details seamlessly, and animal shelters to showcase adoptable pets to a loving community —
                                all in one place.
                            </p>
                        </article>
                    </section>

                    {/* Mission */}
                    <section className="mb-12 rounded-3xl bg-accent p-6 text-center shadow-sm sm:p-8 md:p-10">
                        <h2 className="text-on-accent mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">Our Mission</h2>
                        <p className="text-on-accent-muted mb-6 text-base font-medium sm:text-lg md:text-xl">
                            To provide a reliable, organized, and loving platform that simplifies pet care and strengthens the bond between pets and
                            their humans.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                            <a
                                href="#"
                                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none"
                            >
                                Learn More
                            </a>

                            <a
                                href="#"
                                className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none"
                            >
                                Contact Us
                            </a>
                        </div>
                    </section>

                    {/* Closing statement */}
                    <section className="mx-auto max-w-2xl text-center">
                        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                            We are dedicated to building a community where every pet is protected, every owner is supported, and every animal finds a
                            happy home. Thank you for joining us on this journey.
                        </p>
                    </section>
                </main>

                <footer className="mt-12 w-full text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} FurShield. All Rights Reserved.</p>
                </footer>
            </div>
        </Layout>
    );
}
