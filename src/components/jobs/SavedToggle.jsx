import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/client';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { LoginDialog } from '@/components/auth/LoginDialog';

export function SavedToggle({ job, isSaved, onToggle }) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSave = async () => {
    if (!isAuthenticated) {
      // This will be handled by the LoginDialog trigger
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        // Unsave - we need to find the application ID first
        const response = await api.get('/api/applications');
        const application = response.applications.find(app => app.job.id === job.id);
        
        if (application) {
          await api.delete(`/api/applications/${application.id}`);
          setSaved(false);
          toast({ title: "Job removed from saved jobs" });
          if (onToggle) onToggle(false);
        }
      } else {
        // Save
        await api.post('/api/applications', { job, status: 'saved' });
        setSaved(true);
        toast({ title: "Job saved successfully!" });
        if (onToggle) onToggle(true);
      }
    } catch (error) {
      console.error('Save/unsave failed:', error);
      toast({ 
        title: saved ? "Failed to remove job" : "Failed to save job", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginDialog
        trigger={
          <Button variant="outline" size="sm">
            <Bookmark className="w-4 h-4 mr-1" />
            Save Job
          </Button>
        }
        onSuccess={() => handleSave()}
      />
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleSave}
      disabled={loading}
      className={saved ? "text-green-600 border-green-600 hover:bg-green-50" : ""}
    >
      {saved ? (
        <>
          <BookmarkCheck className="w-4 h-4 mr-1" />
          {loading ? "Removing..." : "Saved"}
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 mr-1" />
          {loading ? "Saving..." : "Save Job"}
        </>
      )}
    </Button>
  );
}
