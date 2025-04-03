import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Box, Container, MenuItem, Select, FormControl } from '@mui/material';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        birthday: '',
        address: '',
        gender: '',
        contact_number: '',
        city: '',
        zip_code: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Container>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", mt: 10 }}>
                    <Head title="Register" />

                    <form onSubmit={submit}>
                        <div className='text-left'>
                            <InputLabel htmlFor="name" value="Name" />

                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4 text-left">
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4 text-left">
                            <InputLabel htmlFor="birthday" value="Birthday" />

                            <TextInput
                                id="birthday"
                                type="date"
                                name="birthday"
                                value={data.birthday}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('birthday', e.target.value)}
                                required
                            />

                            <InputError message={errors.birthday} className="mt-2" />
                        </div>

                        <div className="mt-4 text-left">
                            <InputLabel htmlFor="address" value="Address" />

                            <TextInput
                                id="address"
                                type="text"
                                name="address"
                                value={data.address}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('address', e.target.value)}
                                required
                            />
                            <InputLabel htmlFor="address" value="City" />

                           <TextInput
                                id="city"
                                type="text"
                                name="city"
                                value={data.city}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('city', e.target.value)}
                                required
                            />
                            <InputLabel htmlFor="address" value="Zip Code" />

                            <TextInput
                                id="zip_code"
                                type="text"
                                name="zip_code"
                                value={data.zip_code}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('zip_code', e.target.value)}
                                required
                            />

                            <InputError message={errors.address} className="mt-2" />
                        </div>

                        <div className="mt-4 text-left">
                            <InputLabel htmlFor="gender" value="Gender" />
                            <FormControl fullWidth className="mt-1">
                                <Select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    required
                                >
                                    <MenuItem value="">Select Gender</MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                    <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                                </Select>
                            </FormControl>
                            <InputError message={errors.gender} className="mt-2" />
                        </div>

                        <div className="mt-4 text-left">
                            <InputLabel htmlFor="contact_number" value="Contact Number" />

                            <TextInput
                                id="contact_number"
                                type="tel"
                                name="contact_number"
                                value={data.contact_number}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('contact_number', e.target.value)}
                                required
                            />

                            <InputError message={errors.contact_number} className="mt-2" />
                        </div>

                        <div className="mt-4 text-left">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 text-left">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                            />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <Link
                                href={route('login')}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Already registered?
                            </Link>

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Register
                            </PrimaryButton>
                        </div>
                    </form>
                </Box>
            </Container>
        </GuestLayout>
    );
}