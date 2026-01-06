import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Send } from 'lucide-react';

const registrationSchema = z.object({
  full_name: z.string().min(2, 'Full name is required').max(200),
  email: z.string().email('Please enter a valid email').max(255),
  phone_number: z.string().min(8, 'Please enter a valid phone number').max(30),
  company_name: z.string().min(2, 'Company name is required').max(200),
  company_website: z.string().max(255).optional().or(z.literal('')),
  role_designation: z.string().min(2, 'Role/Designation is required').max(100),
  is_ibc_member: z.boolean(),
  notes: z.string().max(1000).optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const MonkRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      is_ibc_member: false,
      notes: '',
      company_website: '',
    },
  });

  const isIbcMember = watch('is_ibc_member');

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    try {
      // Insert into database
      const { error: dbError } = await supabase
        .from('monk_registrations')
        .insert({
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          company_name: data.company_name,
          company_website: data.company_website || null,
          role_designation: data.role_designation,
          is_ibc_member: data.is_ibc_member,
          notes: data.notes || null,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save registration');
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-monk-registration-email', {
        body: data,
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw - registration is saved, email is secondary
      }

      setIsSuccess(true);
      reset();
      
      toast({
        title: 'Registration Successful!',
        description: 'Thank you for registering. We will contact you shortly with further details.',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="register" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Registration Complete!
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for registering for The Monk: Exponential Leadership program. 
              Our team will contact you shortly with payment details and event information.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Register Another Person
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Registration</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Secure Your Seat
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Complete the form below to register for The Monk: Exponential Leadership program. 
            Limited seats available.
          </p>
        </div>

        {/* Registration Form */}
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl mx-auto bg-background rounded-2xl p-8 md:p-12 shadow-premium"
        >
          <div className="grid gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                {...register('full_name')}
                className={errors.full_name ? 'border-destructive' : ''}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="+971 XX XXX XXXX"
                  {...register('phone_number')}
                  className={errors.phone_number ? 'border-destructive' : ''}
                />
                {errors.phone_number && (
                  <p className="text-sm text-destructive">{errors.phone_number.message}</p>
                )}
              </div>
            </div>

            {/* Company & Website */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  placeholder="Your company"
                  {...register('company_name')}
                  className={errors.company_name ? 'border-destructive' : ''}
                />
                {errors.company_name && (
                  <p className="text-sm text-destructive">{errors.company_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_website">Company Website</Label>
                <Input
                  id="company_website"
                  type="text"
                  placeholder="yourcompany.com or N/A"
                  {...register('company_website')}
                  className={errors.company_website ? 'border-destructive' : ''}
                />
                {errors.company_website && (
                  <p className="text-sm text-destructive">{errors.company_website.message}</p>
                )}
              </div>
            </div>

            {/* Role & IBC Member */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role_designation">Role / Designation *</Label>
                <Input
                  id="role_designation"
                  placeholder="CEO, Founder, Director..."
                  {...register('role_designation')}
                  className={errors.role_designation ? 'border-destructive' : ''}
                />
                {errors.role_designation && (
                  <p className="text-sm text-destructive">{errors.role_designation.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_ibc_member">Are you an IBC Member? *</Label>
                <Select
                  value={isIbcMember ? 'yes' : 'no'}
                  onValueChange={(value) => setValue('is_ibc_member', value === 'yes')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes - I am an IBC Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes / Expectations (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Share any specific expectations or questions you have about the program..."
                rows={4}
                {...register('notes')}
                className={errors.notes ? 'border-destructive' : ''}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
            </div>

            {/* Price Display */}
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Your Registration Fee</p>
              <p className="font-display text-3xl font-bold text-foreground">
                {isIbcMember ? (
                  <>
                    <span className="gradient-gold-text">467 AED</span>
                    <span className="text-sm text-muted-foreground font-normal ml-2">(Member Price)</span>
                  </>
                ) : (
                  <>550 AED</>
                )}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Registration
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By registering, you agree to be contacted regarding this event. 
              Payment details will be shared after registration.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default MonkRegistrationForm;
