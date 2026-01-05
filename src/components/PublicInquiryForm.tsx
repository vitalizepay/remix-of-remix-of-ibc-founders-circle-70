import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronLeft, Check, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const inquirySchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100),
  email: z.string().trim().email('Valid email is required').max(255),
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

const PublicInquiryForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!formData.fullName || !formData.companyName || !formData.role || !formData.industry || !formData.yearsInBusiness || !formData.mobile || !formData.email) {
          toast.error('Please fill in all required fields.');
          return false;
        }
        const years = parseInt(formData.yearsInBusiness);
        if (isNaN(years) || years < 0) {
          toast.error('Years in business must be a valid number (0 or greater).');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error('Please enter a valid email address.');
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

    const validationResult = inquirySchema.safeParse({
      ...formData,
      yearsInBusiness: parseInt(formData.yearsInBusiness) || 0,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase.from('membership_inquiries').insert({
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile_number: formData.mobile.trim(),
        company_name: formData.companyName.trim(),
        role_designation: formData.role.trim(),
        industry: formData.industry.trim(),
        years_in_business: parseInt(formData.yearsInBusiness),
        website_or_linkedin: formData.website.trim() || null,
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
      });

      if (dbError) {
        throw dbError;
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-inquiry-email', {
        body: {
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile_number: formData.mobile.trim(),
          company_name: formData.companyName.trim(),
          role_designation: formData.role.trim(),
          industry: formData.industry.trim(),
          years_in_business: parseInt(formData.yearsInBusiness),
          website_or_linkedin: formData.website.trim() || null,
          business_description: formData.businessDescription.trim(),
          business_stage: formData.businessStage,
          reason_to_join: formData.whyJoin.trim(),
          expected_gain: formData.whatToGain.trim(),
          contribution_to_community: formData.howContribute.trim(),
          membership_type: formData.membershipType,
          participate_in_events: formData.willingToParticipate,
          understands_curation: formData.understandsCurated,
          ibc_stories_interest: formData.openToSharing || null,
        },
      });

      if (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the submission if email fails
      }

      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="apply" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Thank You for Applying!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your application has been submitted successfully. Our team will review your application and get back to you shortly.
            </p>
            <div className="p-6 bg-background rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">
                We've received your application for IBC membership. You will receive a confirmation email at <strong>{formData.email}</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
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
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        maxLength={255}
                        required
                      />
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
                    <Label>Current Business Stage *</Label>
                    <RadioGroup
                      value={formData.businessStage}
                      onValueChange={(value) => handleInputChange('businessStage', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="early" id="early" />
                        <Label htmlFor="early" className="flex-1 cursor-pointer">
                          <span className="font-medium">Early Stage</span>
                          <p className="text-sm text-muted-foreground">Just started or in the first few years</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="growing" id="growing" />
                        <Label htmlFor="growing" className="flex-1 cursor-pointer">
                          <span className="font-medium">Growing</span>
                          <p className="text-sm text-muted-foreground">Scaling operations and expanding reach</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="established" id="established" />
                        <Label htmlFor="established" className="flex-1 cursor-pointer">
                          <span className="font-medium">Established</span>
                          <p className="text-sm text-muted-foreground">Well-established with stable operations</p>
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
                    <Label htmlFor="whyJoin">Why do you want to join IBC? *</Label>
                    <Textarea
                      id="whyJoin"
                      value={formData.whyJoin}
                      onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                      placeholder="Share your motivation for joining our community..."
                      rows={3}
                      maxLength={1000}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatToGain">What do you hope to gain from IBC? *</Label>
                    <Textarea
                      id="whatToGain"
                      value={formData.whatToGain}
                      onChange={(e) => handleInputChange('whatToGain', e.target.value)}
                      placeholder="Describe your expectations and goals..."
                      rows={3}
                      maxLength={1000}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="howContribute">How can you contribute to the IBC community? *</Label>
                    <Textarea
                      id="howContribute"
                      value={formData.howContribute}
                      onChange={(e) => handleInputChange('howContribute', e.target.value)}
                      placeholder="Share your expertise, network, or resources you can offer..."
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
                  <RadioGroup
                    value={formData.membershipType}
                    onValueChange={(value) => handleInputChange('membershipType', value)}
                    className="space-y-4"
                  >
                    <div
                      className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        formData.membershipType === 'founding'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="founding" id="founding" className="absolute top-6 right-6" />
                      <Label htmlFor="founding" className="cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-display text-xl font-bold">Founding Membership</span>
                          <span className="px-2 py-0.5 bg-gold/20 text-gold-dark text-xs font-medium rounded-full">
                            Limited
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          Exclusive lifetime membership with special privileges and recognition as a founding member.
                        </p>
                        <div className="text-2xl font-bold text-foreground">AED 1500</div>
                        <p className="text-xs text-muted-foreground">One-time payment</p>
                      </Label>
                    </div>
                    <div
                      className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        formData.membershipType === 'annual'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="annual" id="annual" className="absolute top-6 right-6" />
                      <Label htmlFor="annual" className="cursor-pointer">
                        <div className="font-display text-xl font-bold mb-2">Annual Membership</div>
                        <p className="text-muted-foreground text-sm mb-3">
                          Full access to all IBC benefits, events, and community features for one year.
                        </p>
                        <div className="text-2xl font-bold text-foreground">AED 1200</div>
                        <p className="text-xs text-muted-foreground">Per year</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Step 4: Engagement & Commitment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg border border-border space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="willingToParticipate"
                        checked={formData.willingToParticipate}
                        onCheckedChange={(checked) =>
                          handleInputChange('willingToParticipate', checked === true)
                        }
                      />
                      <Label htmlFor="willingToParticipate" className="cursor-pointer leading-relaxed">
                        I am willing to actively participate in IBC workshops, meetups, and community events. *
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="understandsCurated"
                        checked={formData.understandsCurated}
                        onCheckedChange={(checked) =>
                          handleInputChange('understandsCurated', checked === true)
                        }
                      />
                      <Label htmlFor="understandsCurated" className="cursor-pointer leading-relaxed">
                        I understand that IBC is a curated community and membership is subject to approval. *
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Would you be open to sharing your business journey on IBC Stories? (Optional)</Label>
                    <RadioGroup
                      value={formData.openToSharing}
                      onValueChange={(value) => handleInputChange('openToSharing', value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="sharingYes" />
                        <Label htmlFor="sharingYes" className="cursor-pointer">Yes, I'd love to</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id="sharingMaybe" />
                        <Label htmlFor="sharingMaybe" className="cursor-pointer">Maybe later</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 5: Declaration */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="p-6 bg-muted/50 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-3">Declaration</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      By submitting this application, I confirm that:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                      <li>• All information provided is accurate and truthful</li>
                      <li>• I am authorized to represent the company mentioned</li>
                      <li>• I agree to abide by IBC's community guidelines and values</li>
                      <li>• I understand that membership is subject to approval</li>
                    </ul>
                    <div className="flex items-start space-x-3 pt-4 border-t border-border">
                      <Checkbox
                        id="confirmAccurate"
                        checked={formData.confirmAccurate}
                        onCheckedChange={(checked) =>
                          handleInputChange('confirmAccurate', checked === true)
                        }
                      />
                      <Label htmlFor="confirmAccurate" className="cursor-pointer leading-relaxed font-medium">
                        I confirm that all the information provided above is accurate and I agree to the terms. *
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} className="gap-2">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.confirmAccurate}
                    className="gap-2"
                  >
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

export default PublicInquiryForm;
