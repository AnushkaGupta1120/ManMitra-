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
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Instagram, Send as TelegramIcon, ExternalLink, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
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

const services = [
  "Virtual Support (Chat/Call/Video)",
  "In-Person Support",
  "Elder Care & Companionship",
  "Professional Counselling",
  "Wellness Workshops",
  "Online Support Community"
];

const countryCodes = [
  { code: "+93", country: "Afghanistan" },
  { code: "+355", country: "Albania" },
  { code: "+213", country: "Algeria" },
  { code: "+1-684", country: "American Samoa" },
  { code: "+376", country: "Andorra" },
  { code: "+244", country: "Angola" },
  { code: "+1-264", country: "Anguilla" },
  { code: "+672", country: "Antarctica" },
  { code: "+1-268", country: "Antigua and Barbuda" },
  { code: "+54", country: "Argentina" },
  { code: "+374", country: "Armenia" },
  { code: "+297", country: "Aruba" },
  { code: "+61", country: "Australia" },
  { code: "+43", country: "Austria" },
  { code: "+994", country: "Azerbaijan" },
  { code: "+1-242", country: "Bahamas" },
  { code: "+973", country: "Bahrain" },
  { code: "+880", country: "Bangladesh" },
  { code: "+1-246", country: "Barbados" },
  { code: "+375", country: "Belarus" },
  { code: "+32", country: "Belgium" },
  { code: "+501", country: "Belize" },
  { code: "+229", country: "Benin" },
  { code: "+1-441", country: "Bermuda" },
  { code: "+975", country: "Bhutan" },
  { code: "+591", country: "Bolivia" },
  { code: "+387", country: "Bosnia and Herzegovina" },
  { code: "+267", country: "Botswana" },
  { code: "+55", country: "Brazil" },
  { code: "+246", country: "British Indian Ocean Territory" },
  { code: "+1-284", country: "British Virgin Islands" },
  { code: "+673", country: "Brunei" },
  { code: "+359", country: "Bulgaria" },
  { code: "+226", country: "Burkina Faso" },
  { code: "+257", country: "Burundi" },
  { code: "+855", country: "Cambodia" },
  { code: "+237", country: "Cameroon" },
  { code: "+1", country: "Canada" },
  { code: "+238", country: "Cape Verde" },
  { code: "+1-345", country: "Cayman Islands" },
  { code: "+236", country: "Central African Republic" },
  { code: "+235", country: "Chad" },
  { code: "+56", country: "Chile" },
  { code: "+86", country: "China" },
  { code: "+61", country: "Christmas Island" },
  { code: "+61", country: "Cocos Islands" },
  { code: "+57", country: "Colombia" },
  { code: "+269", country: "Comoros" },
  { code: "+682", country: "Cook Islands" },
  { code: "+506", country: "Costa Rica" },
  { code: "+385", country: "Croatia" },
  { code: "+53", country: "Cuba" },
  { code: "+599", country: "Curacao" },
  { code: "+357", country: "Cyprus" },
  { code: "+420", country: "Czech Republic" },
  { code: "+243", country: "DR Congo" },
  { code: "+45", country: "Denmark" },
  { code: "+253", country: "Djibouti" },
  { code: "+1-767", country: "Dominica" },
  { code: "+1-809", country: "Dominican Republic" },
  { code: "+670", country: "East Timor" },
  { code: "+593", country: "Ecuador" },
  { code: "+20", country: "Egypt" },
  { code: "+503", country: "El Salvador" },
  { code: "+240", country: "Equatorial Guinea" },
  { code: "+291", country: "Eritrea" },
  { code: "+372", country: "Estonia" },
  { code: "+251", country: "Ethiopia" },
  { code: "+500", country: "Falkland Islands" },
  { code: "+298", country: "Faroe Islands" },
  { code: "+679", country: "Fiji" },
  { code: "+358", country: "Finland" },
  { code: "+33", country: "France" },
  { code: "+689", country: "French Polynesia" },
  { code: "+241", country: "Gabon" },
  { code: "+220", country: "Gambia" },
  { code: "+995", country: "Georgia" },
  { code: "+49", country: "Germany" },
  { code: "+233", country: "Ghana" },
  { code: "+350", country: "Gibraltar" },
  { code: "+30", country: "Greece" },
  { code: "+299", country: "Greenland" },
  { code: "+1-473", country: "Grenada" },
  { code: "+1-671", country: "Guam" },
  { code: "+502", country: "Guatemala" },
  { code: "+44-1481", country: "Guernsey" },
  { code: "+224", country: "Guinea" },
  { code: "+245", country: "Guinea-Bissau" },
  { code: "+592", country: "Guyana" },
  { code: "+509", country: "Haiti" },
  { code: "+504", country: "Honduras" },
  { code: "+852", country: "Hong Kong" },
  { code: "+36", country: "Hungary" },
  { code: "+354", country: "Iceland" },
  { code: "+91", country: "India" },
  { code: "+62", country: "Indonesia" },
  { code: "+98", country: "Iran" },
  { code: "+964", country: "Iraq" },
  { code: "+353", country: "Ireland" },
  { code: "+44-1624", country: "Isle of Man" },
  { code: "+972", country: "Israel" },
  { code: "+39", country: "Italy" },
  { code: "+225", country: "Ivory Coast" },
  { code: "+1-876", country: "Jamaica" },
  { code: "+81", country: "Japan" },
  { code: "+44-1534", country: "Jersey" },
  { code: "+962", country: "Jordan" },
  { code: "+7", country: "Kazakhstan" },
  { code: "+254", country: "Kenya" },
  { code: "+686", country: "Kiribati" },
  { code: "+383", country: "Kosovo" },
  { code: "+965", country: "Kuwait" },
  { code: "+996", country: "Kyrgyzstan" },
  { code: "+856", country: "Laos" },
  { code: "+371", country: "Latvia" },
  { code: "+961", country: "Lebanon" },
  { code: "+266", country: "Lesotho" },
  { code: "+231", country: "Liberia" },
  { code: "+218", country: "Libya" },
  { code: "+423", country: "Liechtenstein" },
  { code: "+370", country: "Lithuania" },
  { code: "+352", country: "Luxembourg" },
  { code: "+853", country: "Macau" },
  { code: "+389", country: "Macedonia" },
  { code: "+261", country: "Madagascar" },
  { code: "+265", country: "Malawi" },
  { code: "+60", country: "Malaysia" },
  { code: "+960", country: "Maldives" },
  { code: "+223", country: "Mali" },
  { code: "+356", country: "Malta" },
  { code: "+692", country: "Marshall Islands" },
  { code: "+222", country: "Mauritania" },
  { code: "+230", country: "Mauritius" },
  { code: "+262", country: "Mayotte" },
  { code: "+52", country: "Mexico" },
  { code: "+691", country: "Micronesia" },
  { code: "+373", country: "Moldova" },
  { code: "+377", country: "Monaco" },
  { code: "+976", country: "Mongolia" },
  { code: "+382", country: "Montenegro" },
  { code: "+1-664", country: "Montserrat" },
  { code: "+212", country: "Morocco" },
  { code: "+258", country: "Mozambique" },
  { code: "+95", country: "Myanmar" },
  { code: "+264", country: "Namibia" },
  { code: "+674", country: "Nauru" },
  { code: "+977", country: "Nepal" },
  { code: "+31", country: "Netherlands" },
  { code: "+687", country: "New Caledonia" },
  { code: "+64", country: "New Zealand" },
  { code: "+505", country: "Nicaragua" },
  { code: "+227", country: "Niger" },
  { code: "+234", country: "Nigeria" },
  { code: "+683", country: "Niue" },
  { code: "+850", country: "North Korea" },
  { code: "+1-670", country: "Northern Mariana Islands" },
  { code: "+47", country: "Norway" },
  { code: "+968", country: "Oman" },
  { code: "+92", country: "Pakistan" },
  { code: "+680", country: "Palau" },
  { code: "+970", country: "Palestine" },
  { code: "+507", country: "Panama" },
  { code: "+675", country: "Papua New Guinea" },
  { code: "+595", country: "Paraguay" },
  { code: "+51", country: "Peru" },
  { code: "+63", country: "Philippines" },
  { code: "+64", country: "Pitcairn" },
  { code: "+48", country: "Poland" },
  { code: "+351", country: "Portugal" },
  { code: "+1-787", country: "Puerto Rico" },
  { code: "+974", country: "Qatar" },
  { code: "+242", country: "Republic of the Congo" },
  { code: "+262", country: "Reunion" },
  { code: "+40", country: "Romania" },
  { code: "+7", country: "Russia" },
  { code: "+250", country: "Rwanda" },
  { code: "+590", country: "Saint Barthelemy" },
  { code: "+290", country: "Saint Helena" },
  { code: "+1-869", country: "Saint Kitts and Nevis" },
  { code: "+1-758", country: "Saint Lucia" },
  { code: "+590", country: "Saint Martin" },
  { code: "+508", country: "Saint Pierre and Miquelon" },
  { code: "+1-784", country: "Saint Vincent" },
  { code: "+685", country: "Samoa" },
  { code: "+378", country: "San Marino" },
  { code: "+239", country: "Sao Tome and Principe" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+221", country: "Senegal" },
  { code: "+381", country: "Serbia" },
  { code: "+248", country: "Seychelles" },
  { code: "+232", country: "Sierra Leone" },
  { code: "+65", country: "Singapore" },
  { code: "+1-721", country: "Sint Maarten" },
  { code: "+421", country: "Slovakia" },
  { code: "+386", country: "Slovenia" },
  { code: "+677", country: "Solomon Islands" },
  { code: "+252", country: "Somalia" },
  { code: "+27", country: "South Africa" },
  { code: "+82", country: "South Korea" },
  { code: "+211", country: "South Sudan" },
  { code: "+34", country: "Spain" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+249", country: "Sudan" },
  { code: "+597", country: "Suriname" },
  { code: "+47", country: "Svalbard and Jan Mayen" },
  { code: "+268", country: "Swaziland" },
  { code: "+46", country: "Sweden" },
  { code: "+41", country: "Switzerland" },
  { code: "+963", country: "Syria" },
  { code: "+886", country: "Taiwan" },
  { code: "+992", country: "Tajikistan" },
  { code: "+255", country: "Tanzania" },
  { code: "+66", country: "Thailand" },
  { code: "+228", country: "Togo" },
  { code: "+690", country: "Tokelau" },
  { code: "+676", country: "Tonga" },
  { code: "+1-868", country: "Trinidad and Tobago" },
  { code: "+216", country: "Tunisia" },
  { code: "+90", country: "Turkey" },
  { code: "+993", country: "Turkmenistan" },
  { code: "+1-649", country: "Turks and Caicos Islands" },
  { code: "+688", country: "Tuvalu" },
  { code: "+1-340", country: "U.S. Virgin Islands" },
  { code: "+256", country: "Uganda" },
  { code: "+380", country: "Ukraine" },
  { code: "+971", country: "UAE" },
  { code: "+44", country: "UK" },
  { code: "+1", country: "USA" },
  { code: "+598", country: "Uruguay" },
  { code: "+998", country: "Uzbekistan" },
  { code: "+678", country: "Vanuatu" },
  { code: "+379", country: "Vatican City" },
  { code: "+58", country: "Venezuela" },
  { code: "+84", country: "Vietnam" },
  { code: "+681", country: "Wallis and Futuna" },
  { code: "+212", country: "Western Sahara" },
  { code: "+967", country: "Yemen" },
  { code: "+260", country: "Zambia" },
  { code: "+263", country: "Zimbabwe" },
];

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    countryCode: '+91',
    telegram: '',
    service: '',
    message: ''
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

    // Service validation
    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    // Message validation: limit to 2000 words
    if (formData.message) {
      const words = formData.message.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length > 2000) {
        newErrors.message = "Message should be maximum 2000 words";
      }
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
        service: '',
        message: ''
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
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Email Us</p>
                  <a href="mailto:hello@manmitra.com" className="text-lg font-bold text-manmitra-teal hover:underline flex items-center gap-1">
                    hello@manmitra.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`rounded-xl border-slate-200 focus:border-manmitra-teal focus:ring-manmitra-teal ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="number">Phone Number</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.countryCode}
                          onValueChange={(v) => setFormData({ ...formData, countryCode: v })}
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
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                        className="rounded-xl border-slate-200 focus:border-manmitra-teal focus:ring-manmitra-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Select Service <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.service}
                      onValueChange={(v) => setFormData({ ...formData, service: v })}
                    >
                      <SelectTrigger className={`w-full rounded-xl border-slate-200 ${errors.service ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.service}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        placeholder="Write anything you'd like to share..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`min-h-[150px] rounded-xl border-slate-200 focus:border-manmitra-teal focus:ring-manmitra-teal ${errors.message ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Max 2000 words</span>
                      <span>{formData.message.trim().split(/\s+/).filter(w => w.length > 0).length} / 2000 words</span>
                    </div>
                    {errors.message && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.message}</p>}
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

