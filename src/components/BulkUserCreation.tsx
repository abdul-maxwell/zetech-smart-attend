import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, Check, AlertTriangle } from 'lucide-react';

interface BulkCreationResult {
  message: string;
  total_profiles: number;
  created: number;
  errors: number;
  results: Array<{
    profile_id: string;
    email?: string;
    auth_user_id?: string;
    success: boolean;
    error?: string;
  }>;
}

export const BulkUserCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BulkCreationResult | null>(null);
  const { toast } = useToast();

  const handleBulkCreate = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('bulk-create-users');

      if (error) throw error;

      setResult(data);
      toast({
        title: "Bulk User Creation Completed",
        description: `Created ${data.created} users successfully. ${data.errors} errors.`,
      });
    } catch (error: any) {
      console.error('Bulk creation error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create users',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk User Creation
        </CardTitle>
        <CardDescription>
          Create authentication users for existing profiles with default passwords.
          Students will use their admission number, admins/lecturers will use "admin".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleBulkCreate}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Users...
            </>
          ) : (
            'Create Authentication Users'
          )}
        </Button>

        {result && (
          <div className="space-y-3">
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                <strong>Results:</strong> {result.message}
                <br />
                Total profiles: {result.total_profiles} | 
                Created: {result.created} | 
                Errors: {result.errors}
              </AlertDescription>
            </Alert>

            {result.errors > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Some users could not be created. Check the detailed results below.
                </AlertDescription>
              </Alert>
            )}

            <div className="max-h-60 overflow-y-auto border rounded p-3 bg-gray-50">
              <h4 className="font-semibold mb-2">Detailed Results:</h4>
              {result.results.map((item, index) => (
                <div key={index} className="text-sm mb-1">
                  <span className={item.success ? 'text-green-600' : 'text-red-600'}>
                    {item.success ? '✓' : '✗'}
                  </span>
                  {' '}
                  {item.email || item.profile_id}
                  {item.error && <span className="text-red-500"> - {item.error}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};