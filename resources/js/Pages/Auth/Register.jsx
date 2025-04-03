import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Box, Container, MenuItem, Select, FormControl, Typography, Paper, Divider } from '@mui/material';
import { Person, Email, Cake, Home, Transgender, Phone, Lock } from '@mui/icons-material';

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
            <Container maxWidth="sm">
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    minHeight: '100vh',
                    py: 4
                }}>
                    <Paper elevation={3} sx={{ 
                        p: { xs: 3, md: 4 }, 
                        width: '100%', 
                        borderRadius: 3
                    }}>
                        <Head title="Register" />
                        
                        <Typography variant="h4" component="h1" gutterBottom sx={{ 
                            fontWeight: 700,
                            mb: 3,
                            textAlign: 'center',
                            color: 'primary.main'
                        }}>
                            Create Your Account
                        </Typography>
                        
                        <form onSubmit={submit}>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="name" value="Full Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    startAdornment={<Person sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.name} />
                            </FormControl>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    startAdornment={<Email sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.email} />
                            </FormControl>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="birthday" value="Birthday" />
                                <TextInput
                                    id="birthday"
                                    type="date"
                                    name="birthday"
                                    value={data.birthday}
                                    onChange={(e) => setData('birthday', e.target.value)}
                                    required
                                    startAdornment={<Cake sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.birthday} />
                            </FormControl>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="gender" value="Gender" />
                                <Select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    required
                                    startAdornment={<Transgender sx={{ color: 'action.active', mr: 1 }} />}
                                >
                                    <MenuItem value="">Select Gender</MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                    <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                                </Select>
                                <InputError message={errors.gender} />
                            </FormControl>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="address" value="Street Address" />
                                <TextInput
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    required
                                    startAdornment={<Home sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.address} />
                            </FormControl>
                            
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="city" value="City" />
                                    <TextInput
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        required
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ width: '30%' }}>
                                    <InputLabel htmlFor="zip_code" value="Zip Code" />
                                    <TextInput
                                        id="zip_code"
                                        type="text"
                                        name="zip_code"
                                        value={data.zip_code}
                                        onChange={(e) => setData('zip_code', e.target.value)}
                                        required
                                    />
                                </FormControl>
                            </Box>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="contact_number" value="Contact Number" />
                                <TextInput
                                    id="contact_number"
                                    type="tel"
                                    name="contact_number"
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                    required
                                    startAdornment={<Phone sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.contact_number} />
                            </FormControl>
                            
                            <Divider sx={{ my: 3 }} />
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    startAdornment={<Lock sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.password} />
                            </FormControl>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </FormControl>
                            
                            <Box sx={{ 
                                mt: 4,
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 2
                            }}>
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <Link href={route('login')} style={{ fontWeight: 600 }}>
                                        Sign in here
                                    </Link>
                                </Typography>
                                
                                <PrimaryButton 
                                    type="submit"
                                    disabled={processing}
                                    sx={{ 
                                        px: 4,
                                        py: 1.5,
                                        width: { xs: '100%', sm: 'auto' }
                                    }}
                                >
                                    Register
                                </PrimaryButton>
                            </Box>
                        </form>
                    </Paper>
                </Box>
            </Container>
        </GuestLayout>
    );
}