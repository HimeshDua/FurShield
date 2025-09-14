import Layout from '@/layouts/layout';

export default function Contact() {
    return (
        <Layout title="Contact Us">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">Get In Touch</h1>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Have questions or want to collaborate? Fill out the form below or find us on the map.
                    </p>
                </div>

                {/* Grid: Form + Map */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Contact Form */}
                    <section aria-labelledby="contact-heading" className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h2 id="contact-heading" className="mb-4 text-2xl font-semibold text-foreground">
                            Send Us a Message
                        </h2>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="name" className="mb-1 block text-sm font-medium text-muted-foreground">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    aria-label="Your name"
                                    className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-1 block text-sm font-medium text-muted-foreground">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    aria-label="Your email"
                                    className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="mb-1 block text-sm font-medium text-muted-foreground">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    aria-label="Your message"
                                    rows={5}
                                    className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Your message..."
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-semibold text-white hover:opacity-95 focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Map / Location */}
                    <aside className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 text-2xl font-semibold text-foreground">Our Location</h2>

                        <div className="w-full overflow-hidden rounded-lg bg-muted">
                            {/* Keep map responsive using aspect ratio */}
                            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                <iframe
                                    title="Aptech Garden Center Map"
                                    src="https://maps.google.com/maps?q=APWA Complex, 1st Floor, Agha Khan 3 Rd, Garden East Saddar Town, Karachi, Sindh 74400&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                                    className="absolute inset-0 h-full w-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-muted-foreground">
                            <p>APWA Complex, 1st Floor, Agha Khan 3 Rd, Garden East Saddar Town, Karachi, Sindh 74400, Pakistan</p>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
}
