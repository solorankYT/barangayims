import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Box, Container, MenuItem, Select, FormControl, Typography, Paper, Divider, Button, FormControlLabel, Checkbox } from '@mui/material';
import { Person, Email, Cake, Home, Transgender, Phone, Lock, CloudUpload} from '@mui/icons-material';
import axios from 'axios';
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        birthday: '',
        address: '',
        gender: '',
        contact_number: '',
        city: '',
        zip_code: '',
        household_head: 'false',
        household: '',
        valid_id: '',
    });

    useEffect(() => {
        console.log("Form data changed:", data);
    }, [data]);

    const [households, setHouseholds] = useState([]);
    const [isHouseholdHead, setIsHouseholdHead] = useState(false);

    const fetchHouseholds = async () => {
        try {
            const response = await axios.get('/getHouseholds');
            if (response.data && response.data.households) {
                setHouseholds(response.data.households); // Set the households array
            }
        } catch (error) {
            console.error("Error fetching households:", error);
        }
    };

    useEffect(() => {
        fetchHouseholds();
    }, []);

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'valid_id' && value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, value);
            }
          });

        post(route('register'), {
            data: formData,
            forceFormData: true,
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
                                <InputLabel htmlFor="first_name" value="First Name" />
                                <TextInput
                                    id="first_name"
                                    name="first_name"
                                    value={data.first_name}
                                    autoComplete="first_name"
                                    isFocused={true}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                    startAdornment={<Person sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.first_name} />
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="middle_name" value="Middle Name" />
                                <TextInput
                                    id="middle_name"
                                    name="middle_name"
                                    value={data.middle_name}
                                    autoComplete="middle_name"
                                    isFocused={true}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    required
                                    startAdornment={<Person sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.middle_name} />
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel htmlFor="last_name" value="Last Name" />
                                <TextInput
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    autoComplete="last_name"
                                    isFocused={true}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                    startAdornment={<Person sx={{ color: 'action.active', mr: 1 }} />}
                                />
                                <InputError message={errors.last_name} />
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


                            <FormControlLabel 
                                control={
                                    <Checkbox 
                                    checked={data.household_head}
                                    onChange={(e) => {
                                        const isHead = e.target.checked;
                                        setData({
                                        ...data,
                                        household_head: isHead,
                                        household: isHead ? null : data.household
                                        });
                                    }}
                                    />
                                }
                                label="Household Head?"
                                />

                                {!data.household_head && households.length > 0 && (
                                <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.household}>
                                    <InputLabel htmlFor="household">Select Household</InputLabel>
                                    <Select
                                    id="household"
                                    value={data.household || ''}
                                    onChange={(e) => setData('household', e.target.value)}
                                    required
                                    >
                                    {households.map((household) => (
                                        <MenuItem key={household.id} value={household.id}>
                                        {household.name}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                    <InputError message={errors.household} />
                                </FormControl>
                                )}

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


                            <Button 
                                component="label" 
                                variant="outlined" 
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ mb: 1 }}
                                >
                                Upload ID
                                <input 
                                    type="file" 
                                    hidden 
                                    required
                                    onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      
                                        if (e.target.files[0].size > 2 * 1024 * 1024) {
                                        alert('File size must be less than 2MB');
                                        return;
                                        }
                                        setData('valid_id', e.target.files[0]);
                                    }
                                    }}
                                    accept="image/*,.pdf"
                                />
                                </Button>

                                {data.valid_id && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Selected file: {data.valid_id.name} ({Math.round(data.valid_id.size / 1024)} KB)
                                </Typography>
                                )}

                                <Typography variant="body2" sx={{ mb: 1 }}>
                                Upload a valid ID for verification (JPEG, PNG, or PDF, max 2MB)
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                (e.g., Government ID addressed to the barangay address, driver's license, passport)
                                </Typography>
  
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