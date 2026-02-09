import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  societyName: z.string().min(2, 'Society name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  hiveCode: z.string().min(1, 'Hive Access Code is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.hiveCode.toLowerCase() === 'taran', {
  message: 'Invalid Hive Code. Please contact an admin for access.',
  path: ['hiveCode'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.societyName);
    setIsLoading(false);

    if (error) {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Registration successful!',
        description: 'You can now sign in to your account.',
      });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen mesh-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Student Feed
          </Link>
          <Link to="/" className="text-2xl font-extrabold text-foreground mb-2 block">
            Hive
          </Link>
          <CardTitle>Register Your Society</CardTitle>
          <CardDescription>
            Create an account to post events for your society
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="societyName">Society Name</Label>
              <Input
                id="societyName"
                placeholder="e.g. Economics Society"
                className="rounded-xl"
                {...register('societyName')}
              />
              {errors.societyName && (
                <p className="text-sm text-destructive">{errors.societyName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="society@soton.ac.uk"
                className="rounded-xl"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="rounded-xl"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                className="rounded-xl"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hiveCode">Hive Access Code</Label>
              <Input
                id="hiveCode"
                type="text"
                placeholder="Enter your invite code"
                className="rounded-xl"
                {...register('hiveCode')}
              />
              {errors.hiveCode && (
                <p className="text-sm text-destructive">{errors.hiveCode.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-gradient-start hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
