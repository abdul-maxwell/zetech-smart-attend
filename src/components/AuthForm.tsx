
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GraduationCap, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('admission');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Map different login types to email format for Supabase
      let email = formData.identifier;
      
      // If not already an email, format it
      if (!email.includes('@')) {
        email = `${formData.identifier}@zetech.ac.ke`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid credentials. Please check your details and try again.');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success('Login successful!');
        onAuthSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    toast.info('Biometric authentication would be implemented in the mobile app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-blue-600 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">ZETECH SmartAttend</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Secure student attendance tracking system
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginType">Login Method</Label>
              <Select value={loginType} onValueChange={setLoginType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose login method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admission">Admission Number</SelectItem>
                  <SelectItem value="id">ID Number</SelectItem>
                  <SelectItem value="birth_cert">Birth Certificate</SelectItem>
                  <SelectItem value="email">School Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier">
                {loginType === 'admission' && 'Admission Number'}
                {loginType === 'id' && 'ID Number'}
                {loginType === 'birth_cert' && 'Birth Certificate Number'}
                {loginType === 'email' && 'School Email'}
              </Label>
              <Input
                id="identifier"
                type={loginType === 'email' ? 'email' : 'text'}
                placeholder={
                  loginType === 'admission' ? 'Enter admission number' :
                  loginType === 'id' ? 'Enter ID number' :
                  loginType === 'birth_cert' ? 'Enter birth certificate number' :
                  'Enter school email'
                }
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleBiometricLogin}
          >
            <Fingerprint className="mr-2 h-4 w-4" />
            Use Biometric Login
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>No sign-up available. Contact admin for account access.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
