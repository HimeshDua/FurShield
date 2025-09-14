import DeleteUser from '@/Components/delete-user';
import HeadingSmall from '@/Components/heading-small';
import InputError from '@/Components/InputError';
import ConditionalLayout from '@/Components/layout/conditionalLayout';
import LogoutSection from '@/Components/logout-user';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/components/ui/separator';
import SettingsLayout from '@/Layouts/settings/layout';
import { BreadcrumbItem, PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth, isRequestSend } = usePage<PageProps>().props;

    // console.log(isRequestSend);
    const { data, setData, patch, get, errors, processing, recentlySuccessful } = useForm({
        name: auth.user?.name,
        email: auth.user?.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const vetRequest = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('owner.request'));
    };
    return (
        <ConditionalLayout breadcrumbs={breadcrumbs} title="Profile settings">
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user?.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                {auth.user?.role === 'owner' && !isRequestSend?.[0]?.id && (
                    <>
                        <Separator />

                        <div className="space-y-6">
                            <HeadingSmall
                                title="Want to become a Veterinarian?"
                                description="Submit a request to list yourself as a Veterinarian on the platform."
                            />

                            <div className="space-y-4 rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-200/10 dark:bg-green-700/10">
                                <div className="relative space-y-0.5 text-green-700 dark:text-green-100">
                                    <p className="font-medium">Info</p>
                                    <p className="text-sm">
                                        Once approved, you will be able to create and manage your own veterinarian profile and accept appointments
                                        from pet owners.
                                    </p>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Request Veterinarian Access</Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogTitle>Request Veterinarian Access</DialogTitle>
                                        <DialogDescription>
                                            Submitting this request will notify our team. You will be contacted once your account is approved as a
                                            Veterinarian.
                                        </DialogDescription>

                                        <form className="space-y-6" onSubmit={vetRequest /* rename your handler here */}>
                                            {/* Hidden field, backend uses Auth::user() */}
                                            <input type="hidden" name="email" value={data.email} />

                                            <InputError message={errors.email} />

                                            <DialogFooter className="gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="secondary">Cancel</Button>
                                                </DialogClose>

                                                <Button disabled={processing} asChild>
                                                    <button type="submit">{processing ? 'Submitting...' : 'Submit Request'}</button>
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </>
                )}

                <Separator />

                <LogoutSection />

                {auth.user?.role == 'owner' && !isRequestSend?.[0]?.id && (
                    <>
                        <Separator />

                        <div className="space-y-6">
                            <HeadingSmall title="Want to become a vendor?" description="Submit a request to list your services on the platform." />

                            <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-200/10 dark:bg-blue-700/10">
                                <div className="relative space-y-0.5 text-blue-700 dark:text-blue-100">
                                    <p className="font-medium">Info</p>
                                    <p className="text-sm">Once approved, you will be able to create and manage your own service listings.</p>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Request Vendor Access</Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogTitle>Request Vendor Access</DialogTitle>
                                        <DialogDescription>
                                            Submitting this request will notify our team. You will be contacted once your account is approved as a
                                            vendor.
                                        </DialogDescription>

                                        <form className="space-y-6" onSubmit={vetRequest}>
                                            <input type="hidden" name="email" value={data.email} />

                                            <InputError message={errors.email} />

                                            <DialogFooter className="gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="secondary">Cancel</Button>
                                                </DialogClose>

                                                <Button disabled={processing} asChild>
                                                    <button type="submit">{processing ? 'Submitting...' : 'Submit Request'}</button>
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </>
                )}

                <Separator />

                <DeleteUser />
            </SettingsLayout>
        </ConditionalLayout>
    );
}
