import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronLeft, Check, Send, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ApplicationStatus from './ApplicationStatus';
import { z } from 'zod';

const applicationSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100),
  companyName: z.string().trim().min(1, 'Company name is required').max(200),
  role: z.string().trim().min(1, 'Role is required').max(100),
  industry: z.string().trim().min(1, 'Industry is required').max(100),
  yearsInBusiness: z.number().int().min(0, 'Years must be 0 or greater'),
  mobile: z.string().trim().min(1, 'Mobile number is required').max(20),
  businessDescription: z.string().trim().min(1, 'Business description is required').max(500),
  businessStage: z.enum(['early', 'growing', 'established']),
  whyJoin: z.string().trim().min(1, 'This field is required').max(1000),
  whatToGain: z.string().trim().min(1, 'This field is required').max(1000),
  howContribute: z.string().trim().min(1, 'This field is required').max(1000),
  membershipType: z.enum(['founding', 'annual']),
  willingToParticipate: z.literal(true, { errorMap: () => ({ message: 'You must agree to participate' }) }),
  understandsCurated: z.literal(true, { errorMap: () => ({ message: 'You must acknowledge this' }) }),
  confirmAccurate: z.literal(true, { errorMap: () => ({ message: 'You must confirm the declaration' }) }),
});

const MembershipApplicationForm = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    role: '',
    industry: '',
    yearsInBusiness: '',
    website: '',
    email: '',
    mobile: '',
    businessDescription: '',
    businessStage: '',
    whyJoin: '',
    whatToGain: '',
    howContribute: '',
    membershipType: '',
    willingToParticipate: false,
    understandsCurated: false,
    openToSharing: '',
    confirmAccurate: false,
  });

  const steps = [
    { title: 'Personal Details', description: 'Your contact information' },
    { title: 'Business Overview', description: 'Tell us about your business' },
    { title: 'Community Fit', description: 'Why IBC is right for you' },
    { title: 'Membership', description: 'Choose your membership' },
    { title: 'Commitment', description: 'Your engagement level' },
    { title: 'Declaration', description: 'Final confirmation' },
  ];

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user) {
        setCheckingApplication(false);
        return;
      }

      const { data } = await supabase
        .from('ibc_membership_applications')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setHasExistingApplication(true);
      }
      setCheckingApplication(false);
    };

    checkExistingApplication();
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!formData.fullName || !formData.companyName || !formData.role || !formData.industry || !formData.yearsInBusiness || !formData.mobile) {
          toast.error('Please fill in all required fields.');
          return false;
        }
        const years = parseInt(formData.yearsInBusiness);
        if (isNaN(years) || years < 0) {
          toast.error('Years in business must be a valid number (0 or greater).');
          return false;
        }
        break;
      case 1:
        if (!formData.businessDescription || !formData.businessStage) {
          toast.error('Please fill in all required fields.');
          return false;
        }
        break;
      case 2:
        if (!formData.whyJoin || !formData.whatToGain || !formData.howContribute) {
          toast.error('Please fill in all required fields.');
          return false;
        }
        break;
      case 3:
        if (!formData.membershipType) {
          toast.error('Please select a membership type.');
          return false;
        }
        break;
      case 4:
        if (!formData.willingToParticipate || !formData.understandsCurated) {
          toast.error('Please confirm both commitments to continue.');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.confirmAccurate) {
      toast.error('Please confirm that the information provided is accurate.');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to submit an application.');
      return;
    }

    // Validate all fields
    const validationResult = applicationSchema.safeParse({
      ...formData,
      yearsInBusiness: parseInt(formData.yearsInBusiness) || 0,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('ibc_membership_applications').insert({
        user_id: user.id,
        full_name: formData.fullName.trim(),
        company_name: formData.companyName.trim(),
        role_designation: formData.role.trim(),
        industry: formData.industry.trim(),
        years_in_business: parseInt(formData.yearsInBusiness),
        website_or_linkedin: formData.website.trim() || null,
        email: user.email || formData.email,
        mobile_number: formData.mobile.trim(),
        business_description: formData.businessDescription.trim(),
        business_stage: formData.businessStage as 'early' | 'growing' | 'established',
        reason_to_join: formData.whyJoin.trim(),
        expected_gain: formData.whatToGain.trim(),
        contribution_to_community: formData.howContribute.trim(),
        membership_type: formData.membershipType as 'founding' | 'annual',
        participate_in_events: formData.willingToParticipate,
        understands_curation: formData.understandsCurated,
        ibc_stories_interest: formData.openToSharing ? (formData.openToSharing as 'yes' | 'maybe') : null,
        declaration_confirmed: formData.confirmAccurate,
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('You have already submitted an application.');
          setHasExistingApplication(true);
        } else {
          throw error;
        }
      } else {
        // Send email notification
        try {
          await supabase.functions.invoke('send-inquiry-email', {
            body: {
              full_name: formData.fullName.trim(),
              company_name: formData.companyName.trim(),
              role_designation: formData.role.trim(),
              industry: formData.industry.trim(),
              years_in_business: parseInt(formData.yearsInBusiness),
              website_or_linkedin: formData.website.trim() || null,
              email: user.email || formData.email,
              mobile_number: formData.mobile.trim(),
              business_description: formData.businessDescription.trim(),
              business_stage: formData.businessStage,
              reason_to_join: formData.whyJoin.trim(),
              expected_gain: formData.whatToGain.trim(),
              contribution_to_community: formData.howContribute.trim(),
              membership_type: formData.membershipType,
              participate_in_events: formData.willingToParticipate,
              understands_curation: formData.understandsCurated,
              ibc_stories_interest: formData.openToSharing || null,
              declaration_confirmed: formData.confirmAccurate,
            },
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
          // Don't fail the submission if email fails
        }
        
        setIsSubmitted(true);
        toast.success('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (authLoading || checkingApplication) {
    return (
      <section id="apply" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <section id="apply" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold-dark text-sm font-medium rounded-full mb-4">
                Join the Circle
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Apply to Join IBC
              </h2>
              <p className="text-muted-foreground mb-8">
                Please sign in or create an account to submit your membership application.
              </p>
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate('/auth')}
                className="gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In to Apply
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show existing application status
  if (hasExistingApplication || isSubmitted) {
    return <ApplicationStatus />;
  }

  return (
    <section id="apply" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold-dark text-sm font-medium rounded-full mb-4">
              Join the Circle
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Apply to Join IBC
            </h2>
            <p className="text-muted-foreground">
              Membership is curated to preserve the integrity of the community. 
              All applications are reviewed before confirmation.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      index < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : index === currentStep
                        ? 'bg-primary text-primary-foreground shadow-emerald'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2 hidden sm:block whitespace-nowrap">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit}>
            <div className="bg-background rounded-2xl p-8 shadow-premium border border-border">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>

              {/* Step 0: Personal Details */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Your full name"
                        maxLength={100}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Your company name"
                        maxLength={200}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Your Role / Designation *</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        placeholder="CEO, Founder, etc."
                        maxLength={100}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        placeholder="e.g., Technology, Healthcare"
                        maxLength={100}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                      <Input
                        id="yearsInBusiness"
                        type="number"
                        min="0"
                        value={formData.yearsInBusiness}
                        onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                        placeholder="e.g., 5"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website / LinkedIn (Optional)</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://"
                        maxLength={500}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        readOnly
                        className="bg-muted cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">Auto-filled from your account</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        placeholder="+971 XX XXX XXXX"
                        maxLength={20}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Business Overview */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">
                      Briefly describe your business (2–3 lines) *
                    </Label>
                    <Textarea
                      id="businessDescription"
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                      placeholder="What does your business do? Who do you serve?"
                      rows={4}
                      maxLength={500}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>What stage is your business currently in? *</Label>
                    <RadioGroup
                      value={formData.businessStage}
                      onValueChange={(value) => handleInputChange('businessStage', value)}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="early" id="early" />
                        <Label htmlFor="early" className="font-normal cursor-pointer">
                          Early Stage (0-2 years)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="growing" id="growing" />
                        <Label htmlFor="growing" className="font-normal cursor-pointer">
                          Growing (2-5 years)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="established" id="established" />
                        <Label htmlFor="established" className="font-normal cursor-pointer">
                          Established (5+ years)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 2: Community Fit */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="whyJoin">
                      Why do you want to join Indian Business Circle (IBC)? *
                    </Label>
                    <Textarea
                      id="whyJoin"
                      value={formData.whyJoin}
                      onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                      placeholder="What draws you to IBC?"
                      rows={3}
                      maxLength={1000}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatToGain">
                      What do you hope to gain from the IBC community? *
                    </Label>
                    <Textarea
                      id="whatToGain"
                      value={formData.whatToGain}
                      onChange={(e) => handleInputChange('whatToGain', e.target.value)}
                      placeholder="Learning, connections, mentorship..."
                      rows={3}
                      maxLength={1000}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="howContribute">
                      How do you think you can contribute to the IBC community? *
                    </Label>
                    <Textarea
                      id="howContribute"
                      value={formData.howContribute}
                      onChange={(e) => handleInputChange('howContribute', e.target.value)}
                      placeholder="Your expertise, experience, network..."
                      rows={3}
                      maxLength={1000}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Membership Selection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Label>Which membership are you applying for? *</Label>
                  <RadioGroup
                    value={formData.membershipType}
                    onValueChange={(value) => handleInputChange('membershipType', value)}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <RadioGroupItem value="founding" id="founding" className="mt-1" />
                      <div>
                        <Label htmlFor="founding" className="font-semibold cursor-pointer">
                          Founding Membership
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          AED 1,500 (Year 1) • Limited availability • Lifetime renewal at AED 1,080 • 
                          Inner Circle access
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <RadioGroupItem value="annual" id="annual" className="mt-1" />
                      <div>
                        <Label htmlFor="annual" className="font-semibold cursor-pointer">
                          Annual Membership
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          AED 1,200 per year • Full workshop access • Monthly networking • 
                          Community features
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Step 4: Engagement & Commitment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="participate"
                        checked={formData.willingToParticipate}
                        onCheckedChange={(checked) =>
                          handleInputChange('willingToParticipate', !!checked)
                        }
                      />
                      <div>
                        <Label htmlFor="participate" className="font-normal cursor-pointer">
                          Are you willing to actively participate in workshops and monthly meetups? *
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Active participation is key to the IBC experience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="curated"
                        checked={formData.understandsCurated}
                        onCheckedChange={(checked) =>
                          handleInputChange('understandsCurated', !!checked)
                        }
                      />
                      <div>
                        <Label htmlFor="curated" className="font-normal cursor-pointer">
                          Do you understand that IBC is a curated community and applications are 
                          reviewed before approval? *
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          We review all applications to ensure community quality
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Label className="mb-3 block">
                      Would you be open to sharing your business journey as part of IBC Stories? (Optional)
                    </Label>
                    <RadioGroup
                      value={formData.openToSharing}
                      onValueChange={(value) => handleInputChange('openToSharing', value)}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="yes" id="share-yes" />
                        <Label htmlFor="share-yes" className="font-normal cursor-pointer">
                          Yes, I'd love to share
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="maybe" id="share-maybe" />
                        <Label htmlFor="share-maybe" className="font-normal cursor-pointer">
                          Maybe later
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 5: Declaration */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="p-6 bg-muted/50 rounded-xl">
                    <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                      Declaration
                    </h4>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="confirm"
                        checked={formData.confirmAccurate}
                        onCheckedChange={(checked) =>
                          handleInputChange('confirmAccurate', !!checked)
                        }
                      />
                      <Label htmlFor="confirm" className="font-normal cursor-pointer leading-relaxed">
                        I confirm that the information provided above is accurate and complete. 
                        I understand that IBC membership is curated and my application will be 
                        reviewed by the IBC team.
                      </Label>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      By submitting this application, you agree to our community guidelines 
                      and understand that all memberships are subject to approval.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button type="button" variant="hero" onClick={nextStep} className="gap-2">
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" variant="gold" size="lg" className="gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MembershipApplicationForm;
