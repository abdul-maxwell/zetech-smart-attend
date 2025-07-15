
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import AuthForm from '@/components/AuthForm';
import StudentDashboard from '@/components/StudentDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';
import { Button } from '@/components/ui/button';
import { LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType } from '@/types';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log('Setting up auth listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('Fetching profile for user:', session.user.id);
          fetchUserProfile(session.user.id);
        } else {
          console.log('No user, clearing profile');
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for userId:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Error loading profile');
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Profile found:', data);
        setUserProfile(data);
      } else {
        console.log('No profile found for user');
        toast.error('No profile found for user');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Error loading profile');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error signing out');
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  const handleAuthSuccess = () => {
    toast.success('Welcome to ZETECH SmartAttend!');
  };

  const handlePasswordChanged = () => {
    // Refresh the user profile to get updated force_password_change status
    if (user) {
      fetchUserProfile(user.id);
    }
    toast.success('Password updated successfully!');
  };

  console.log('Render state:', { loading, user: !!user, userProfile: !!userProfile });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No authenticated user, showing auth form');
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  if (!userProfile) {
    console.log('User exists but no profile found, showing error');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Profile Error</h2>
            <p className="text-gray-600 mb-4">
              Your account exists but no profile was found. Please contact administrator.
            </p>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out & Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <span className="text-white font-bold text-sm">ZU</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ZETECH SmartAttend
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {userProfile.first_name} {userProfile.last_name}
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      <PasswordChangeDialog
        open={userProfile.force_password_change}
        userProfile={userProfile}
        onPasswordChanged={handlePasswordChanged}
      />

      {/* Main Content */}
      {userProfile.force_password_change ? null : (
        userProfile.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <StudentDashboard user={userProfile} />
        )
      )}
    </div>
  );
};

export default Index;
