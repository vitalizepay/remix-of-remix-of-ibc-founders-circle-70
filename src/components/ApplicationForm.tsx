import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronLeft, Check, Send } from 'lucide-react';
import { toast } from 'sonner';

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Section 1: Personal & Business Details
    fullName: '',
    companyName: '',
    role: '',
    industry: '',
    yearsInBusiness: '',
    website: '',
    email: '',
    mobile: '',
    // Section 2: Business Overview
    businessDescription: '',
    businessStage: '',
    // Section 3: Community Fit
    whyJoin: '',
    whatToGain: '',
    howContribute: '',
    // Section 4: Membership Selection
    membershipType: '',
    // Section 5: Engagement & Commitment
    willingToParticipate: false,
    understandsCurated: false,
    // Section 6: IBC Stories
    openToSharing: '',
    // Section 7: Declaration
    confirmAccurate: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmAccurate) {
      toast.error('Please confirm that the information provided is accurate.');
      return;
    }
    // Simulate submission
    setIsSubmitted(true);
    toast.success('Application submitted successfully!');
  };

  if (isSubmitted) {
    return (
      <section id="apply" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Application Received
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for applying to join Indian Business Circle. Our team will review 
              your application and get back to you within 3-5 business days.
            </p>
            <p className="text-muted-foreground">
              In the meantime, follow us for updates and community insights.
            </p>
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
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                      <Input
                        id="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                        placeholder="e.g., 5 years"
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
                        placeholder="you@company.com"
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
                      Would you be open to sharing your business journey as part of IBC Stories?
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
                  disabled={currentStep === 0}
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
                  <Button type="submit" variant="gold" size="lg" className="gap-2">
                    <Send className="w-4 h-4" />
                    Submit Application
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

export default ApplicationForm;
