import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Send, Instagram, Send as TelegramIcon, ExternalLink, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const reasons = [
  "Grief", "Conflict", "Anger Issues", "Identity Crisis", "Work Related Issues", 
  "Sleeping Disorder", "Loneliness", "Fear", "Health Concerns", "Student Life", 
  "Anxiety", "Family Issues", "Relationship Issues", "Unknown Sadness", 
  "Stress", "Self Confidence", "Depression", "Other - Not listed above"
];

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "Singapore" },
];

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    countryCode: '+91',
    telegram: '',
    reason: '',
    contactMe: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation: alphabetical only, max 50
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should only contain alphabetical characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name should be maximum 50 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Number validation (optional but must be valid if provided)
    if (formData.number && !/^\d{7,15}$/.test(formData.number)) {
      newErrors.number = "Please enter a valid phone number (7-15 digits)";
    }

    // Reason validation
    if (!formData.reason) {
      newErrors.reason = "Please select a reason for reaching out";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const path = 'submissions';
    
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        number: '',
        countryCode: '+91',
        telegram: '',
        reason: '',
        contactMe: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="section-padding bg-white">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-manmitra-teal-light p-12 rounded-[3rem] border border-manmitra-teal/10"
          >
            <div className="w-20 h-20 bg-manmitra-teal rounded-full flex items-center justify-center text-white mx-auto mb-6">
              <Send className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
            <p className="text-lg text-slate-600 mb-8">
              Thank you for reaching out to ManMitra. We have received your message 
              and will get back to you within 24 hours.
            </p>
            <Button 
              onClick={() => setIsSuccess(false)}
              className="rounded-full bg-manmitra-teal hover:bg-manmitra-teal/90 text-white px-8"
            >
              Send Another Message
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-section" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-slate-600 mb-10">
              We're here to listen and support you. Fill out the form, and our team 
              will get back to you as soon as possible. Your journey to wellness 
              starts with a single step.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-manmitra-teal-light border border-manmitra-teal/10 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-manmitra-teal flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Instagram</p>
                  <a href="https://www.instagram.com/_manmitra/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-manmitra-teal hover:underline flex items-center gap-1">
                    @_manmitra <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-manmitra-yellow-light border border-manmitra-yellow/10 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-manmitra-yellow flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <TelegramIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Telegram</p>
                  <a href="https://t.me/Manmitra" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-manmitra-yellow hover:underline flex items-center gap-1">
                    @Manmitra <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Read Our Blogs</p>
                  <a href="https://medium.com/@Manmitra" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-slate-800 hover:underline flex items-center gap-1">
                    Medium <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-manmitra-teal text-white p-8">
                <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
                <CardDescription className="text-manmitra-teal-light opacity-90">
                  We'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`rounded-xl border-slate-200 focus:border-manmitra-teal focus:ring-manmitra-teal ${errors.name ? 'border-red-500' : ''}`} 
                      />
                      {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`rounded-xl border-slate-200 focus:border-manmitra-teal focus:ring-manmitra-teal ${errors.email ? 'border-red-500' : ''}`} 
                      />
                      {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="number">Phone Number (Optional)</Label>
                      <div className="flex gap-2">
                        <Select 
                          value={formData.countryCode} 
                          onValueChange={(v) => setFormData({...formData, countryCode: v})}
                        >
                          <SelectTrigger className="w-[100px] rounded-xl border-slate-200">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((c) => (
                              <SelectItem key={c.code} value={c.code}>{c.code} ({c.country})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          id="number" 
                          type="tel" 
                          placeholder="9876543210" 
                          value={formData.number}
                          onChange={(e) => setFormData({...formData, number: e.target.value})}
                          className={`flex-1 rounded-xl border-slate-200 focus:border-manmitra-teal focus:ring-manmitra-teal ${errors.number ? 'border-red-500' : ''}`} 
                        />
                      </div>
                      {errors.number && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.number}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegram">Telegram ID</Label>
                      <Input 
                        id="telegram" 
                        placeholder="@username" 
                        value={formData.telegram}
                        onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                        className="rounded-xl border-slate-200 focus:border-manmitra-teal focus:ring-manmitra-teal" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for reaching out <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.reason} 
                      onValueChange={(v) => setFormData({...formData, reason: v})}
                    >
                      <SelectTrigger className={`w-full rounded-xl border-slate-200 ${errors.reason ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasons.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.reason && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.reason}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <Checkbox 
                      id="contact-me" 
                      checked={formData.contactMe}
                      onCheckedChange={(v) => setFormData({...formData, contactMe: !!v})}
                      className="data-[state=checked]:bg-manmitra-teal data-[state=checked]:border-manmitra-teal" 
                    />
                    <Label htmlFor="contact-me" className="text-sm font-medium leading-none cursor-pointer">
                      Would you like us to contact you?
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-manmitra-teal hover:bg-manmitra-teal/90 text-white py-6 text-lg font-bold shadow-lg shadow-manmitra-teal/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


