import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/layouts/layout';
import { CarrotIcon, DogIcon, HeartPulseIcon, ScissorsIcon, ShieldPlusIcon } from 'lucide-react';

const petTips = [
    {
        category: 'Grooming',
        icon: <ScissorsIcon />,
        tips: [
            {
                title: 'Coat Brushing',
                description: 'Regular brushing prevents matting, distributes natural oils, and reduces shedding, especially for long-haired breeds.',
            },
            {
                title: 'Nail Trimming',
                description:
                    'Trim your pet’s nails every 3-4 weeks to avoid discomfort and potential paw deformities. Be careful to avoid the quick.',
            },
            {
                title: 'Bathing Routine',
                description: 'Bathe your pet with a gentle, vet-approved shampoo only when necessary to avoid skin irritation from over-bathing.',
            },
            {
                title: 'Ear and Eye Care',
                description:
                    'Check your pet’s ears weekly for redness or odor. Gently clean their eyes with a soft, damp cloth to remove any discharge.',
            },
        ],
    },
    {
        category: 'Training',
        icon: <DogIcon />,
        tips: [
            {
                title: 'Positive Reinforcement',
                description: 'Reward your pet with treats, praise, or toys for desired behaviors to build a strong, trusting bond.',
            },
            {
                title: 'Consistency is Key',
                description:
                    'Use the same commands and signals consistently. Ensure all family members are on the same page to avoid confusing your pet.',
            },
            {
                title: 'Start with Basics',
                description: 'Begin with simple commands like "sit," "stay," and "come." Keep sessions short and fun to maintain their attention.',
            },
            {
                title: 'Early Socialization',
                description: 'Expose your pet to a variety of people, animals, and environments from a young age to help them become well-adjusted.',
            },
        ],
    },
    {
        category: 'Nutrition',
        icon: <CarrotIcon />,
        tips: [
            {
                title: 'Balanced Diet',
                description:
                    "Choose a high-quality pet food that is complete and balanced for your pet's specific life stage, size, and health needs.",
            },
            {
                title: 'Portion Control',
                description:
                    'Follow the feeding guidelines on the food package to avoid overfeeding, which can lead to obesity and other health issues.',
            },
            {
                title: 'Fresh Water',
                description: 'Always provide your pet with access to fresh, clean water. Change it daily and clean their bowl regularly.',
            },
            {
                title: 'Avoid Toxic Foods',
                description: 'Never give your pet human foods that are toxic to them, such as chocolate, onions, and grapes.',
            },
        ],
    },
    {
        category: 'Health',
        icon: <HeartPulseIcon />,
        tips: [
            {
                title: 'Regular Vet Check-ups',
                description:
                    'Schedule annual check-ups to monitor your pet’s overall health and ensure they are up-to-date on vaccinations and parasite control.',
            },
            {
                title: 'Weight Management',
                description: 'Maintaining a healthy weight is crucial for preventing health issues. Monitor your pet’s body condition score.',
            },
            {
                title: 'Early Warning Signs',
                description:
                    'Pay close attention to changes in your pet’s behavior, appetite, or bathroom habits as they can be subtle indicators of an illness.',
            },
            {
                title: 'Parasite Prevention',
                description:
                    'Talk to your vet about a comprehensive parasite prevention plan to protect against fleas, ticks, heartworm, and other parasites.',
            },
        ],
    },
    {
        category: 'Safety',
        icon: <ShieldPlusIcon />,
        tips: [
            {
                title: 'Pet-Proofing Your Home',
                description:
                    'Ensure your home is safe by securing cleaning supplies, medicines, and other toxic substances. Keep electrical cords out of reach.',
            },
            {
                title: 'Leash and ID Tags',
                description:
                    'Always keep your pet on a leash outdoors and ensure they wear a collar with up-to-date identification tags as a first line of defense if they get lost.',
            },
            {
                title: 'Microchipping',
                description:
                    'Microchipping provides a permanent form of identification. A vet or shelter can scan the chip to retrieve your contact information if your pet is lost.',
            },
            {
                title: 'Car Safety',
                description: 'Never leave your pet alone in a car, especially on a hot day. Use a pet car seat or harness for safe travel.',
            },
        ],
    },
];

export default function PetCare() {
    return (
        <Layout title="Pet Care Tips">
            <div className="mx-auto max-w-6xl py-8">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Comprehensive Pet Care Tips</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Everything you need to know to ensure your furry, feathered, or scaled friend is happy and healthy.
                    </p>
                </header>

                <div className="flex flex-col items-center">
                    <Tabs defaultValue="Grooming" className="w-full">
                        <TabsList className="mb-4 flex flex-wrap justify-center gap-2 sm:gap-4">
                            {petTips.map((section) => (
                                <TabsTrigger key={section.category} value={section.category}>
                                    <div className="flex items-center gap-2">
                                        {section.icon}
                                        <span className="text-sm font-medium sm:text-base">{section.category}</span>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {petTips.map((section) => (
                            <TabsContent key={section.category} value={section.category} className="w-full">
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="flex-shrink-0 rounded-full bg-primary/10 p-3 text-primary">{section.icon}</div>
                                        <div>
                                            <CardTitle className="text-2xl font-semibold text-foreground">{section.category} Tips</CardTitle>
                                            <CardDescription className="pt-1 text-muted-foreground">
                                                Find detailed tips for keeping your pet in great shape.
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            {section.tips.map((tip, tipIndex) => (
                                                <div
                                                    key={tipIndex}
                                                    className="rounded-lg border bg-card p-4 transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm"
                                                >
                                                    <h3 className="mb-1 text-lg font-semibold text-foreground">{tip.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}
