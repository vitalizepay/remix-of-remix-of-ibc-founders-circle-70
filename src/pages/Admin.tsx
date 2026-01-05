import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Download, Search, Filter, Eye, Loader2, ShieldAlert } from 'lucide-react';
import ibcLogo from '@/assets/ibc-logo.png';

interface Application {
  id: string;
  user_id: string;
  application_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  full_name: string;
  company_name: string;
  role_designation: string;
  industry: string;
  years_in_business: number;
  website_or_linkedin: string | null;
  email: string;
  mobile_number: string;
  business_description: string;
  business_stage: 'early' | 'growing' | 'established';
  reason_to_join: string;
  expected_gain: string;
  contribution_to_community: string;
  membership_type: 'founding' | 'annual';
  participate_in_events: boolean;
  understands_curation: boolean;
  ibc_stories_interest: 'yes' | 'maybe' | null;
  declaration_confirmed: boolean;
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ibc_membership_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch applications');
      console.error(error);
    } else {
      setApplications(data as Application[]);
    }
    setLoading(false);
  };

  const updateApplicationStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setUpdatingStatus(id);
    const { error } = await supabase
      .from('ibc_membership_applications')
      .update({ application_status: status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
      console.error(error);
    } else {
      toast.success(`Application ${status}`);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, application_status: status } : app))
      );
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => prev ? { ...prev, application_status: status } : null);
      }
    }
    setUpdatingStatus(null);
  };

  const exportToCSV = () => {
    const headers = [
      'Full Name',
      'Company',
      'Role',
      'Industry',
      'Years in Business',
      'Email',
      'Mobile',
      'Business Stage',
      'Membership Type',
      'Status',
      'Applied Date',
    ];

    const rows = filteredApplications.map((app) => [
      app.full_name,
      app.company_name,
      app.role_designation,
      app.industry,
      app.years_in_business,
      app.email,
      app.mobile_number,
      app.business_stage,
      app.membership_type,
      app.application_status,
      new Date(app.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ibc-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter;
    const matchesMembership = membershipFilter === 'all' || app.membership_type === membershipFilter;
    return matchesSearch && matchesStatus && matchesMembership;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.application_status === 'pending').length,
    approved: applications.filter((a) => a.application_status === 'approved').length,
    rejected: applications.filter((a) => a.application_status === 'rejected').length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <Button variant="hero" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <img src={ibcLogo} alt="IBC" className="h-10 w-auto" />
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Membership Applications</p>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <p className="font-display text-3xl font-bold text-foreground">{statusCounts.all}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="font-display text-3xl font-bold text-gold">{statusCounts.pending}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="font-display text-3xl font-bold text-primary">{statusCounts.approved}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="font-display text-3xl font-bold text-destructive">{statusCounts.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 border border-border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, company, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-44">
                <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="founding">Founding</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No applications found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{app.full_name}</p>
                        <p className="text-sm text-muted-foreground">{app.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{app.company_name}</p>
                        <p className="text-sm text-muted-foreground">{app.role_designation}</p>
                      </div>
                    </TableCell>
                    <TableCell>{app.industry}</TableCell>
                    <TableCell>
                      <span className="capitalize">{app.membership_type}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          app.application_status === 'pending'
                            ? 'bg-gold/20 text-gold-dark'
                            : app.application_status === 'approved'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {app.application_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(app);
                          setIsDetailOpen(true);
                        }}
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Application Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  {selectedApplication.full_name}
                </DialogTitle>
                <DialogDescription>
                  Application submitted on{' '}
                  {new Date(selectedApplication.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status Actions */}
                <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground mr-2">Update Status:</span>
                  <Button
                    size="sm"
                    variant={selectedApplication.application_status === 'approved' ? 'default' : 'outline'}
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                    disabled={updatingStatus === selectedApplication.id}
                    className="gap-1"
                  >
                    {updatingStatus === selectedApplication.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : null}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedApplication.application_status === 'pending' ? 'default' : 'outline'}
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'pending')}
                    disabled={updatingStatus === selectedApplication.id}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedApplication.application_status === 'rejected' ? 'destructive' : 'outline'}
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                    disabled={updatingStatus === selectedApplication.id}
                  >
                    Reject
                  </Button>
                </div>

                {/* Personal Details */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Personal & Business Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Company</p>
                      <p className="font-medium">{selectedApplication.company_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Role</p>
                      <p className="font-medium">{selectedApplication.role_designation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Industry</p>
                      <p className="font-medium">{selectedApplication.industry}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Years in Business</p>
                      <p className="font-medium">{selectedApplication.years_in_business}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mobile</p>
                      <p className="font-medium">{selectedApplication.mobile_number}</p>
                    </div>
                    {selectedApplication.website_or_linkedin && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Website / LinkedIn</p>
                        <a
                          href={selectedApplication.website_or_linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {selectedApplication.website_or_linkedin}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Overview */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Business Overview</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Business Stage</p>
                      <p className="font-medium capitalize">{selectedApplication.business_stage}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Business Description</p>
                      <p className="font-medium">{selectedApplication.business_description}</p>
                    </div>
                  </div>
                </div>

                {/* Community Fit */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Community Fit</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Why join IBC?</p>
                      <p className="font-medium">{selectedApplication.reason_to_join}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">What they hope to gain</p>
                      <p className="font-medium">{selectedApplication.expected_gain}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">How they can contribute</p>
                      <p className="font-medium">{selectedApplication.contribution_to_community}</p>
                    </div>
                  </div>
                </div>

                {/* Membership & Commitment */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Membership & Commitment</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Membership Type</p>
                      <p className="font-medium capitalize">{selectedApplication.membership_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Participate in Events</p>
                      <p className="font-medium">{selectedApplication.participate_in_events ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Understands Curation</p>
                      <p className="font-medium">{selectedApplication.understands_curation ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">IBC Stories Interest</p>
                      <p className="font-medium capitalize">{selectedApplication.ibc_stories_interest || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
