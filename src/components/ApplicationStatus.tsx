import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Clock, XCircle, FileText } from 'lucide-react';

interface Application {
  id: string;
  application_status: 'pending' | 'approved' | 'rejected';
  full_name: string;
  company_name: string;
  membership_type: 'founding' | 'annual';
  created_at: string;
}

const ApplicationStatus = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('ibc_membership_applications')
        .select('id, application_status, full_name, company_name, membership_type, created_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setApplication(data as Application);
      }
      setLoading(false);
    };

    fetchApplication();
  }, [user]);

  if (loading) {
    return (
      <section id="apply" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-6" />
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4" />
              <div className="h-4 bg-muted rounded w-96 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!application) {
    return null;
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      title: 'Application Under Review',
      description: 'Thank you for applying to join Indian Business Circle. Our team is reviewing your application and will get back to you within 3-5 business days.',
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
    approved: {
      icon: Check,
      title: 'Application Approved!',
      description: 'Congratulations! Your application has been approved. Welcome to the Indian Business Circle community. We will contact you shortly with next steps.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    rejected: {
      icon: XCircle,
      title: 'Application Not Approved',
      description: 'Unfortunately, we were unable to approve your application at this time. If you have questions, please contact our team.',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  };

  const config = statusConfig[application.application_status];
  const StatusIcon = config.icon;

  return (
    <section id="apply" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <StatusIcon className={`w-10 h-10 ${config.color}`} />
          </div>
          
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            {config.title}
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            {config.description}
          </p>

          {/* Application Summary Card */}
          <div className="bg-background rounded-xl p-6 shadow-premium border border-border text-left max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Application Summary</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applicant</span>
                <span className="font-medium text-foreground">{application.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium text-foreground">{application.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membership Type</span>
                <span className="font-medium text-foreground capitalize">{application.membership_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium text-foreground">
                  {new Date(application.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-semibold capitalize ${config.color}`}>
                  {application.application_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationStatus;
