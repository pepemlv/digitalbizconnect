import {
  FolderOpen, FileText, Search, Users,
  Shield, ClipboardList, BookOpen,
  Star, CreditCard, Repeat,
  Package, CalendarCheck, FileSignature,
  CheckCircle, Leaf,
  Building, Calculator, Video,
  Bell, Lock,
  Map, Award, Image,
  Globe, Megaphone,
  type LucideIcon,
} from 'lucide-react';
import joiPhoto from '../../images/joi.png';
import insuranceBackground from '../../images/insurbkg.png';

export interface DemoFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface DemoTestimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  tag: string;
}

export interface DemoService {
  name: string;
  price: string;
  duration: string;
}

export interface DemoMenuItem {
  name: string;
  desc: string;
  price: string;
}

export interface DemoProperty {
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  img: string;
  tag: string;
}

export interface IndustryConfig {
  id: string;
  industry: string;
  businessName: string;
  tagline: string;
  subTagline: string;
  heroImage: string;
  agentName?: string;
  agentTitle?: string;
  agentPhoto?: string;
  agentPhotoAlt?: string;
  websiteDomain?: string;
  accentHex: string;
  accentLightHex: string;
  accentTextHex: string;
  navLinks: string[];
  phone: string;
  address: string;
  ctaText: string;
  ctaSubtext: string;
  features: DemoFeature[];
  testimonials: DemoTestimonial[];
  galleryImages: string[];
  // Widget-specific
  widgetType: 'booking' | 'quote' | 'menu' | 'property' | 'policy' | 'results';
  services?: DemoService[];
  menuItems?: { category: string; items: DemoMenuItem[] }[];
  properties?: DemoProperty[];
  quoteOptions?: { label: string; options: string[] }[];
}

const cleaningGalleryImages = [
  'https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4108713/pexels-photo-4108713.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3771837/pexels-photo-3771837.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const cleaningFeatures: DemoFeature[] = [
  { icon: Repeat, title: 'Recurring Service Plans', desc: 'Customers choose weekly, bi-weekly, monthly, or one-time service without calling.' },
  { icon: CheckCircle, title: 'Trust-Building Proof', desc: 'Show reviews, insurance, background checks, and quality guarantees where they convert.' },
  { icon: Leaf, title: 'Service Add-Ons', desc: 'Offer deep cleaning, eco products, appliance cleaning, windows, and rush appointments.' },
  { icon: CreditCard, title: 'Online Booking & Payments', desc: 'Capture deposits, cards on file, and completed bookings from any device.' },
];

const cleaningQuoteOptions = [
  { label: 'Property Size', options: ['Studio / 1BR', '2 Bedrooms', '3 Bedrooms', '4 Bedrooms', '5+ Bedrooms'] },
  { label: 'Service Type', options: ['Standard Clean', 'Deep Clean', 'Move-In/Out', 'Commercial', 'Custom Request'] },
  { label: 'Frequency', options: ['One-Time', 'Weekly', 'Bi-Weekly', 'Monthly', 'Rush Service'] },
];

const cleaningTemplateConfigs: IndustryConfig[] = [
  {
    id: 'maid-service',
    industry: 'Cleaning Companies',
    businessName: 'Sanchez Cleaning Services',
    tagline: 'Reliable Home Cleaning on Your Schedule',
    subTagline: 'Professional cleaning services in Charlotte with easy quote requests, callback scheduling, and fast online booking.',
    heroImage: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1400',
    websiteDomain: 'sanchezcleanservice.com',
    accentHex: '#14B8A6',
    accentLightHex: '#CCFBF1',
    accentTextHex: '#134E4A',
    navLinks: ['Services', 'Pricing', 'Reviews', 'Book Now'],
    phone: '+1 (704) 488-3818',
    address: '4251 Springhaven Dr, Charlotte, NC 28269',
    ctaText: 'Book a Home Clean',
    ctaSubtext: 'Choose your rooms, schedule, and recurring plan online.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Monica Davis', role: 'Homeowner', text: 'The booking flow made it easy to set up weekly service and update instructions before every visit.', rating: 5, tag: 'Weekly Service' },
      { name: 'Erin Miles', role: 'Busy Parent', text: 'The cleaner profiles and reminders helped us feel confident from the first appointment.', rating: 5, tag: 'Family Home' },
      { name: 'David Kim', role: 'Remote Worker', text: 'I booked a deep clean during lunch and had confirmation before my next meeting.', rating: 5, tag: 'Deep Clean' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: cleaningQuoteOptions,
  },
  {
    id: 'commercial-cleaning',
    industry: 'Cleaning Companies',
    businessName: 'Charlotte Cleaning Service',
    tagline: 'Spotless Offices, Healthier Workdays',
    subTagline: 'Commercial and residential cleaning support in Charlotte with quote requests, service plans, and callback scheduling.',
    heroImage: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=1400',
    websiteDomain: 'charlottecleanservices.com',
    accentHex: '#2563EB',
    accentLightHex: '#DBEAFE',
    accentTextHex: '#1E3A8A',
    navLinks: ['Industries', 'Walkthrough', 'Plans', 'Contact'],
    phone: '+1 (704) 741-5912',
    address: '9805 Statesville Rd Ste. 6190, Charlotte, NC 28269',
    ctaText: 'Request a Walkthrough',
    ctaSubtext: 'Schedule an on-site or virtual cleaning assessment.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Alicia Brooks', role: 'Office Manager', text: 'Their site made it simple to compare nightly, weekly, and specialty cleaning packages.', rating: 5, tag: 'Office Cleaning' },
      { name: 'Ben Carter', role: 'Retail Director', text: 'The walkthrough request form sends the exact details our team needs before quoting.', rating: 5, tag: 'Retail Store' },
      { name: 'Nadia Patel', role: 'Clinic Admin', text: 'Trust badges and compliance details were easy to find, which mattered for our clinic.', rating: 5, tag: 'Medical Suite' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Facility Type', options: ['Office', 'Retail', 'Medical Suite', 'Warehouse', 'School / Daycare'] },
      { label: 'Square Footage', options: ['Under 2,500', '2,500-5,000', '5,000-15,000', '15,000+'] },
      { label: 'Schedule', options: ['Daily', '3x Weekly', 'Weekly', 'Monthly', 'Custom'] },
    ],
  },
  {
    id: 'carpet-cleaning',
    industry: 'Cleaning Companies',
    businessName: 'Oxy Magic of the Carolinas',
    tagline: 'Deep Carpet Cleaning with Instant Room Quotes',
    subTagline: 'Carpet cleaning service in Charlotte built for room-based quotes, stain treatment requests, and fast callbacks.',
    heroImage: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=1400',
    websiteDomain: 'oxymagiccleaingservice.com',
    accentHex: '#7C3AED',
    accentLightHex: '#EDE9FE',
    accentTextHex: '#4C1D95',
    navLinks: ['Rooms', 'Stain Care', 'Gallery', 'Book'],
    phone: '+1 (704) 947-4959',
    address: '3611 Mt Holly-Huntersville Rd, Charlotte, NC 28216',
    ctaText: 'Price My Rooms',
    ctaSubtext: 'Get a room-by-room estimate before booking.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Heather Long', role: 'Homeowner', text: 'I added pet stain treatment and stairs in one quote. The price was clear before checkout.', rating: 5, tag: 'Pet Stains' },
      { name: 'Luis Romero', role: 'Property Manager', text: 'Turnover carpet cleaning requests come in organized by unit, room count, and timeline.', rating: 5, tag: 'Rental Turnover' },
      { name: 'Tina Moore', role: 'Real Estate Agent', text: 'The before-and-after gallery helped my seller book immediately.', rating: 5, tag: 'Listing Prep' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Rooms', options: ['1-2 Rooms', '3-4 Rooms', '5-6 Rooms', 'Whole Home'] },
      { label: 'Add-Ons', options: ['Pet Treatment', 'Stairs', 'Upholstery', 'Area Rugs', 'Deodorizer'] },
      { label: 'Timeline', options: ['Today', 'This Week', 'Next Week', 'Flexible'] },
    ],
  },
  {
    id: 'window-cleaning',
    industry: 'Cleaning Companies',
    businessName: 'Scrub and Shine Cleaning Solutions',
    tagline: 'House Cleaning That Makes Every Room Shine',
    subTagline: 'House cleaning service with quick quote requests, callback scheduling, and clear service options for local customers.',
    heroImage: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#0891B2',
    accentLightHex: '#CFFAFE',
    accentTextHex: '#164E63',
    navLinks: ['Residential', 'Commercial', 'Pricing', 'Schedule'],
    phone: '+1 (704) 804-8850',
    address: 'Charlotte, NC - House cleaning service',
    ctaText: 'Estimate My Windows',
    ctaSubtext: 'Count your panes and reserve the best service window.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Janelle Price', role: 'Homeowner', text: 'The pane-count estimator was fast and the crew arrived with the right ladder setup.', rating: 5, tag: 'Residential' },
      { name: 'Mark Feldman', role: 'Store Owner', text: 'We book storefront glass on a recurring plan and never have to chase invoices.', rating: 5, tag: 'Storefront' },
      { name: 'Sofia Grant', role: 'HOA Coordinator', text: 'The service area pages made it easy for residents to book during our neighborhood route.', rating: 5, tag: 'HOA Route' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Property Type', options: ['Home', 'Storefront', 'Office', 'Multi-Unit', 'HOA Route'] },
      { label: 'Window Count', options: ['1-10', '11-25', '26-50', '50+'] },
      { label: 'Service', options: ['Exterior Only', 'Interior + Exterior', 'Screens', 'Tracks', 'Recurring'] },
    ],
  },
  {
    id: 'pressure-washing',
    industry: 'Cleaning Companies',
    businessName: 'New Hope Cleaning Services',
    tagline: 'Exterior Cleaning That Restores Curb Appeal',
    subTagline: 'Pressure washing service in Charlotte for driveways, siding, patios, decks, and exterior cleaning requests.',
    heroImage: 'https://images.pexels.com/photos/4239119/pexels-photo-4239119.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#0EA5E9',
    accentLightHex: '#E0F2FE',
    accentTextHex: '#0C4A6E',
    navLinks: ['Services', 'Photos', 'Service Areas', 'Quote'],
    phone: '+1 (704) 833-8750',
    address: '4340 Hey Rock Ct, Charlotte, NC 28269',
    ctaText: 'Get Exterior Quote',
    ctaSubtext: 'Choose surfaces, square footage, and add-ons.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Grant Miller', role: 'Homeowner', text: 'The driveway and siding quote was simple, and the photos sold me immediately.', rating: 5, tag: 'Driveway' },
      { name: 'Priya Shah', role: 'Restaurant Owner', text: 'We booked patio and storefront washing before opening weekend with no back-and-forth.', rating: 5, tag: 'Commercial' },
      { name: 'Kyle Johnson', role: 'Realtor', text: 'I send sellers to the instant quote page before listing photos.', rating: 5, tag: 'Pre-Listing' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Surface', options: ['Driveway', 'Siding', 'Deck / Patio', 'Fence', 'Commercial Exterior'] },
      { label: 'Size', options: ['Small', 'Medium', 'Large', 'Multi-Surface'] },
      { label: 'Add-Ons', options: ['Soft Wash', 'Gutter Brightening', 'Rust Removal', 'Same-Week Service'] },
    ],
  },
  {
    id: 'move-out-cleaning',
    industry: 'Cleaning Companies',
    businessName: 'B & Z Cleaning Services LLC',
    tagline: 'Deposit-Friendly Cleans for Every Move',
    subTagline: 'Cleaning service in Charlotte for homes, apartments, move-out requests, and property cleaning needs.',
    heroImage: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#F97316',
    accentLightHex: '#FFEDD5',
    accentTextHex: '#7C2D12',
    navLinks: ['Checklist', 'Pricing', 'Landlords', 'Book'],
    phone: '+1 (980) 348-9139',
    address: '3143 Forestbrook Dr #3, Charlotte, NC 28208',
    ctaText: 'Book Move-Out Clean',
    ctaSubtext: 'Select your deadline and property checklist.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Brianna Wells', role: 'Renter', text: 'The move-out checklist matched my lease requirements and helped me get my deposit back.', rating: 5, tag: 'Apartment' },
      { name: 'Victor Allen', role: 'Landlord', text: 'I book unit turns directly from the site and attach special notes for each property.', rating: 5, tag: 'Unit Turn' },
      { name: 'Maya Collins', role: 'Realtor', text: 'Rush booking saved a closing week clean when another vendor cancelled.', rating: 5, tag: 'Rush Clean' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Property', options: ['Apartment', 'Townhome', 'Single-Family', 'Rental Unit', 'Listing Prep'] },
      { label: 'Bedrooms', options: ['Studio', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms'] },
      { label: 'Deadline', options: ['24 Hours', '48 Hours', 'This Week', 'Flexible'] },
    ],
  },
  {
    id: 'post-construction-cleaning',
    industry: 'Cleaning Companies',
    businessName: 'Xtreme Cleaning Services LLC',
    tagline: 'Reliable Cleaning Service for Homes and Projects',
    subTagline: 'Black-owned cleaning service in Charlotte with online requests for home cleaning, project cleaning, and callbacks.',
    heroImage: 'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#D97706',
    accentLightHex: '#FEF3C7',
    accentTextHex: '#92400E',
    navLinks: ['Rough Clean', 'Final Clean', 'Projects', 'Quote'],
    phone: '+1 (704) 534-2273',
    address: 'Brookway Dr, Charlotte, NC 28208',
    ctaText: 'Request Project Clean',
    ctaSubtext: 'Send project size, timeline, and cleaning phase.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Evan Brooks', role: 'General Contractor', text: 'The project form collects square footage, phase, and timeline before we ever talk.', rating: 5, tag: 'Final Clean' },
      { name: 'Sandra Lee', role: 'Designer', text: 'Their gallery makes the service feel premium enough for high-end remodel clients.', rating: 5, tag: 'Remodel' },
      { name: 'Andre Wilson', role: 'Builder', text: 'Punch-list uploads helped us explain exactly what needed special attention.', rating: 5, tag: 'New Build' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Project Type', options: ['New Build', 'Remodel', 'Commercial TI', 'Apartment Turn', 'Punch List'] },
      { label: 'Phase', options: ['Rough Clean', 'Final Clean', 'Touch-Up', 'Window Detail'] },
      { label: 'Square Footage', options: ['Under 1,500', '1,500-3,000', '3,000-7,500', '7,500+'] },
    ],
  },
  {
    id: 'airbnb-cleaning',
    industry: 'Cleaning Companies',
    businessName: 'Sweets After Hour Cleaning',
    tagline: 'After-Hour Cleaning That Works Around Your Schedule',
    subTagline: 'Cleaning service in Charlotte built for evening requests, flexible callbacks, and convenient online quote forms.',
    heroImage: 'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#E11D48',
    accentLightHex: '#FFE4E6',
    accentTextHex: '#9F1239',
    navLinks: ['Turnovers', 'Hosts', 'Reports', 'Schedule'],
    phone: '+1 (704) 891-0285',
    address: '3442 Markland Dr APT D, Charlotte, NC 28208',
    ctaText: 'Schedule Turnovers',
    ctaSubtext: 'Coordinate cleans between checkout and check-in.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Camila Reyes', role: 'Airbnb Host', text: 'Photo reports and linen notes helped us keep every turnover accountable.', rating: 5, tag: 'Superhost' },
      { name: 'Noah Bennett', role: 'Property Manager', text: 'The template fits multi-property turnover requests perfectly.', rating: 5, tag: 'Multi-Unit' },
      { name: 'Isabel Torres', role: 'Vacation Rental Owner', text: 'Guests mention cleanliness more often since we moved to a consistent turnover schedule.', rating: 5, tag: 'Guest Reviews' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Rental Type', options: ['Studio', 'Condo', 'House', 'Luxury Rental', 'Multi-Property'] },
      { label: 'Turnover Need', options: ['Same-Day', 'Next-Day', 'Recurring Calendar', 'Deep Reset'] },
      { label: 'Add-Ons', options: ['Linen Service', 'Restock', 'Damage Photos', 'Welcome Setup'] },
    ],
  },
  {
    id: 'janitorial-services',
    industry: 'Cleaning Companies',
    businessName: 'MB.SPOTLESS CLEANING SERVICES',
    tagline: 'Dependable Janitorial Teams for Growing Facilities',
    subTagline: 'Charlotte cleaning service with spotless recurring cleaning, quote requests, and callback scheduling for busy customers.',
    heroImage: 'https://images.pexels.com/photos/4099471/pexels-photo-4099471.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#16A34A',
    accentLightHex: '#DCFCE7',
    accentTextHex: '#166534',
    navLinks: ['Facilities', 'Contracts', 'Supplies', 'Contact'],
    phone: '+1 (704) 247-0109',
    address: '700 N Tryon St #329, Charlotte, NC 28202',
    ctaText: 'Build a Service Plan',
    ctaSubtext: 'Tell us your locations, schedule, and facility needs.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Denise Howard', role: 'Facilities Director', text: 'The site explains nightly, day porter, and supply services clearly for our procurement team.', rating: 5, tag: 'Facilities' },
      { name: 'Omar Castillo', role: 'School Admin', text: 'Compliance badges and recurring service plans helped our board approve the vendor.', rating: 5, tag: 'School' },
      { name: 'Megan Stone', role: 'Operations Lead', text: 'Multi-location forms save us from long email threads every time we add a facility.', rating: 5, tag: 'Multi-Location' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Facility', options: ['Office', 'School', 'Warehouse', 'Retail', 'Medical'] },
      { label: 'Locations', options: ['1 Location', '2-3 Locations', '4-10 Locations', '10+ Locations'] },
      { label: 'Schedule', options: ['Nightly', 'Day Porter', 'Weekly', 'Custom Contract'] },
    ],
  },
  {
    id: 'green-cleaning',
    industry: 'Cleaning Companies',
    businessName: "Titi's Cleaning Services",
    tagline: 'Your Favorite Friendly House Cleaning Service',
    subTagline: 'House cleaning service with friendly local support, simple quote requests, and callback scheduling for Charlotte customers.',
    heroImage: 'https://images.pexels.com/photos/5217897/pexels-photo-5217897.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#65A30D',
    accentLightHex: '#ECFCCB',
    accentTextHex: '#365314',
    navLinks: ['Products', 'Services', 'Plans', 'Book'],
    phone: '+1 (980) 776-3262',
    address: 'Charlotte, NC - House cleaning service',
    ctaText: 'Choose Green Cleaning',
    ctaSubtext: 'Select a non-toxic plan for your home or office.',
    features: cleaningFeatures,
    testimonials: [
      { name: 'Lena Morris', role: 'Pet Owner', text: 'The product transparency page made me confident booking with pets at home.', rating: 5, tag: 'Pet-Safe' },
      { name: 'Caleb Young', role: 'Parent', text: 'We switched to recurring green cleaning and the subscription setup was painless.', rating: 5, tag: 'Family Home' },
      { name: 'Jasmine Clark', role: 'Wellness Studio Owner', text: 'Clients care about non-toxic products, and this site communicates that beautifully.', rating: 5, tag: 'Studio' },
    ],
    galleryImages: cleaningGalleryImages,
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Space', options: ['Apartment', 'Home', 'Office', 'Studio', 'Retail'] },
      { label: 'Priority', options: ['Pet-Safe', 'Child-Safe', 'Fragrance-Free', 'Allergy-Friendly', 'Zero-Waste'] },
      { label: 'Frequency', options: ['One-Time', 'Weekly', 'Bi-Weekly', 'Monthly'] },
    ],
  },
];

export const industryConfigs: IndustryConfig[] = [
  {
    id: 'construction',
    industry: 'Construction',
    businessName: 'Apex Build Group',
    tagline: "Midwest's Most Trusted Commercial Builder",
    subTagline: 'Licensed general contractors specializing in commercial builds, renovations, and project management across the tri-state area.',
    heroImage: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#D97706',
    accentLightHex: '#FEF3C7',
    accentTextHex: '#92400E',
    navLinks: ['Projects', 'Services', 'About', 'Contact'],
    phone: '(312) 555-0182',
    address: 'Chicago, IL — Serving Tri-State Area',
    ctaText: 'Get a Free Estimate',
    ctaSubtext: 'No obligation. Response within 24 hours.',
    features: [
      { icon: FolderOpen, title: 'Project Portfolio', desc: 'Showcase every completed project with photos, specs, and client testimonials.' },
      { icon: FileText, title: 'Online Quote System', desc: 'Clients submit project details and receive custom estimates within 24 hours.' },
      { icon: Search, title: 'Local SEO Rankings', desc: 'Rank #1 for "general contractor [city]" searches and capture local leads.' },
      { icon: Users, title: 'Lead Management', desc: 'Every inquiry is tracked in your CRM — never lose a potential contract.' },
    ],
    testimonials: [
      { name: 'Robert Chen', role: 'Property Developer', text: 'Apex delivered our 40,000 sq ft warehouse 3 weeks ahead of schedule. Their project management system kept us informed every step of the way.', rating: 5, tag: 'Commercial Build' },
      { name: 'Linda Vasquez', role: 'Restaurant Owner', text: 'Full gut renovation of our 8,000 sq ft space in 6 weeks. Incredible quality and the online portal made communication effortless.', rating: 5, tag: 'Renovation' },
      { name: 'Mike Patterson', role: 'HOA President', text: 'Managed our entire community center rebuild. Professional, on-budget, and they cleaned up perfectly every day.', rating: 5, tag: 'Community Project' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1490578/pexels-photo-1490578.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Project Type', options: ['Commercial Build', 'Renovation', 'Addition', 'Site Work', 'Interior Fit-Out'] },
      { label: 'Project Size', options: ['Under 1,000 sq ft', '1,000–5,000 sq ft', '5,000–20,000 sq ft', '20,000+ sq ft'] },
      { label: 'Timeline', options: ['ASAP', '1–3 months', '3–6 months', '6+ months'] },
    ],
  },
  {
    id: 'insurance',
    industry: 'Insurance',
    businessName: 'Joi Burgin Insurance',
    tagline: 'Insurance Agent and B2B Sales Specialist',
    subTagline: 'I help individuals and business owners understand their insurance options, protect what matters, and find ways to put money back in their pockets. Insurance is never just about price, but saving money still matters.',
    heroImage: insuranceBackground,
    agentName: 'Joi Burgin',
    agentTitle: 'Insurance Agent, B2B Sales Specialist',
    agentPhoto: joiPhoto,
    agentPhotoAlt: 'Joi Burgin, insurance agent and B2B sales specialist',
    accentHex: '#E1261C',
    accentLightHex: '#FEE2E2',
    accentTextHex: '#991B1B',
    navLinks: ['Coverage', 'Sales Process', 'About', 'Contact'],
    phone: 'Message Joi',
    address: 'Charlotte, North Carolina - Helping individuals and business owners',
    ctaText: 'Request a Coverage Review',
    ctaSubtext: 'I help you compare coverage, understand your rates, and make confident insurance decisions.',
    features: [
      { icon: FileText, title: 'Coverage That Fits You', desc: 'I take time to understand your needs, explain your options, and recommend property and casualty coverage that makes sense.' },
      { icon: Users, title: 'Personal and Business Support', desc: 'Whether you are protecting your family, your property, or your company, I help you move from questions to confident decisions.' },
      { icon: Shield, title: 'Multi-State Insurance Knowledge', desc: 'Previously licensed in over 40 states with practical compliance, claims, and property and casualty insurance experience.' },
      { icon: BookOpen, title: 'Clear Follow-Up', desc: 'I keep the process organized with consistent communication, helpful follow-up, and a customer-first mindset.' },
    ],
    testimonials: [
      { name: 'Policyholder', role: 'Personal Insurance Client', text: 'Joi explained my options clearly and helped me understand what affected my rate without making the conversation only about price.', rating: 5, tag: 'Personal Insurance' },
      { name: 'Business Owner', role: 'Commercial Client', text: 'Joi took time to understand my business, walk through coverage choices, and help me feel confident before moving forward.', rating: 5, tag: 'Business Insurance' },
      { name: 'Returning Client', role: 'Renewal Review', text: 'The follow-up was professional, helpful, and consistent. Joi made the renewal process easy to understand.', rating: 5, tag: 'Client Retention' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/7821686/pexels-photo-7821686.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'policy',
  },
  {
    id: 'restaurants',
    industry: 'Restaurants',
    businessName: 'Trattoria Bella Vista',
    tagline: 'Farm-to-Table Italian in the Heart of Downtown',
    subTagline: 'Handmade pasta, wood-fired pizza, and seasonal ingredients from local farms. Open for dinner Tuesday–Sunday.',
    heroImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#DC2626',
    accentLightHex: '#FEE2E2',
    accentTextHex: '#991B1B',
    navLinks: ['Menu', 'Reservations', 'Gallery', 'Contact'],
    phone: '(312) 555-0174',
    address: '742 W. Michigan Ave, Chicago, IL',
    ctaText: 'Reserve a Table',
    ctaSubtext: 'Book online in 60 seconds. No phone calls needed.',
    features: [
      { icon: ClipboardList, title: 'Online Ordering', desc: 'Full online ordering for dine-in, takeout, and delivery with real-time tracking.' },
      { icon: CalendarCheck, title: 'Table Reservations', desc: 'Guests book instantly — no phone calls, no voicemail, no double-bookings.' },
      { icon: FileText, title: 'Digital Menu CMS', desc: 'Update prices, add specials, and manage 86\'d items in real-time from your phone.' },
      { icon: Star, title: 'Google Review Generation', desc: 'Automated post-visit requests that grow your 5-star ratings on autopilot.' },
    ],
    testimonials: [
      { name: 'Jennifer Walsh', role: 'Food Critic, City Guide', text: 'The truffle pasta is transcendent. Best Italian in Chicago — the online booking makes it so easy to get a table.', rating: 5, tag: 'Dining Review' },
      { name: 'Marco Delgado', role: 'Regular Guest', text: 'We come every anniversary. The staff remembers us, the food is consistently amazing, and the online reservation system is seamless.', rating: 5, tag: 'Anniversary Dinner' },
      { name: 'Priya Nair', role: 'Event Planner', text: 'Hosted our client dinner for 30 here. The private dining room, custom menu, and online ordering for the group made everything perfect.', rating: 5, tag: 'Private Dining' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'menu',
    menuItems: [
      {
        category: 'Starters',
        items: [
          { name: 'Burrata Pugliese', desc: 'Creamy burrata, heirloom tomatoes, basil oil, fleur de sel', price: '$16' },
          { name: 'Carpaccio di Manzo', desc: 'Wagyu beef carpaccio, shaved truffle, arugula, aged parmigiano', price: '$22' },
          { name: 'Fritto Misto', desc: 'Crispy calamari, shrimp, zucchini, lemon aioli', price: '$18' },
        ],
      },
      {
        category: 'Mains',
        items: [
          { name: 'Tagliatelle al Tartufo', desc: 'Hand-rolled pasta, black truffle butter, aged parmigiano, herbs', price: '$38' },
          { name: 'Bistecca alla Fiorentina', desc: '28-oz dry-aged porterhouse, rosemary, grilled lemon, sea salt', price: '$68' },
          { name: 'Branzino al Forno', desc: 'Whole roasted Mediterranean seabass, capers, olives, cherry tomatoes', price: '$44' },
        ],
      },
      {
        category: 'Desserts',
        items: [
          { name: 'Tiramisu della Casa', desc: 'Classic house recipe, espresso-soaked ladyfingers, mascarpone', price: '$12' },
          { name: 'Panna Cotta', desc: 'Vanilla bean panna cotta, seasonal berry compote', price: '$11' },
          { name: 'Gelato Artigianale', desc: 'Three scoops of house-made gelato, rotating flavors', price: '$10' },
        ],
      },
    ],
  },
  {
    id: 'event-rentals',
    industry: 'Event Rentals',
    businessName: 'Premier Party Rentals',
    tagline: 'Make Every Event Unforgettable',
    subTagline: 'The largest selection of premium event equipment in the region — tents, tables, linens, lighting, and more for any occasion.',
    heroImage: 'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#7C3AED',
    accentLightHex: '#EDE9FE',
    accentTextHex: '#4C1D95',
    navLinks: ['Catalog', 'Booking', 'Gallery', 'Contact'],
    phone: '(713) 555-0198',
    address: 'Houston, TX — Delivering within 60 miles',
    ctaText: 'Check Availability',
    ctaSubtext: 'Select your event date and see what\'s available.',
    features: [
      { icon: Package, title: 'Equipment Catalog', desc: '500+ items online with photos, dimensions, and quantity availability.' },
      { icon: CreditCard, title: 'Online Deposits', desc: 'Secure your rental with a 25% deposit. Balance due on delivery.' },
      { icon: CalendarCheck, title: 'Availability Calendar', desc: 'Real-time availability so customers know exactly what\'s open for their date.' },
      { icon: FileSignature, title: 'Digital Contracts', desc: 'e-Sign rental agreements instantly — no printing, no faxing, no delays.' },
    ],
    testimonials: [
      { name: 'Ashley Turner', role: 'Wedding Planner', text: 'Premier handled 12 of my weddings this year. Their online catalog and instant booking saves me hours per event. Flawless delivery every time.', rating: 5, tag: 'Wedding' },
      { name: 'Carlos Reyes', role: 'Corporate Events Manager', text: 'Rented for our 500-person company gala. The tent, tables, linens, lighting — all perfect. The online contract system made approvals instant.', rating: 5, tag: 'Corporate Event' },
      { name: 'Brittany Hall', role: 'Mother of the Bride', text: 'My daughter\'s wedding was a dream. Premier\'s team set up and broke down flawlessly. The deposit system was so easy and secure.', rating: 5, tag: 'Wedding Reception' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1729805/pexels-photo-1729805.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'booking',
    services: [
      { name: 'Standard Package', price: '$499', duration: 'Up to 50 guests' },
      { name: 'Premium Package', price: '$1,299', duration: 'Up to 150 guests' },
      { name: 'Grand Package', price: '$2,999', duration: 'Up to 500 guests' },
    ],
  },
  {
    id: 'cleaning',
    industry: 'Cleaning Companies',
    businessName: 'SparkClean Pro',
    tagline: 'Professional Cleaning, Guaranteed Satisfaction',
    subTagline: 'Background-checked, insured cleaning professionals serving homes and offices. Book online in 60 seconds.',
    heroImage: 'https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#0D9488',
    accentLightHex: '#CCFBF1',
    accentTextHex: '#134E4A',
    navLinks: ['Services', 'Pricing', 'About', 'Book Now'],
    phone: '(303) 555-0167',
    address: 'Denver, CO — Serving Metro Area',
    ctaText: 'Get Instant Quote',
    ctaSubtext: 'See your price in 30 seconds. No phone calls.',
    features: [
      { icon: Repeat, title: 'Recurring Booking', desc: 'Set weekly, bi-weekly, or monthly cleans. We remember everything, you do nothing.' },
      { icon: CheckCircle, title: 'Background-Checked Staff', desc: 'Every cleaner passes a full background check and is fully insured.' },
      { icon: Leaf, title: 'Eco-Friendly Products', desc: 'Non-toxic, pet-safe, and child-safe cleaning products on every visit.' },
      { icon: CreditCard, title: 'Online Payments', desc: 'Secure card-on-file billing after each clean. No cash, no checks.' },
    ],
    testimonials: [
      { name: 'Rachel Green', role: 'Busy Parent', text: 'SparkClean has been cleaning our home weekly for 2 years. The online booking, consistent team, and quality are unmatched.', rating: 5, tag: 'Weekly Clean' },
      { name: 'Tom Bradley', role: 'Property Manager', text: 'I manage 12 rental units. SparkClean handles turnover cleans automatically. The before/after photos sent after each clean are so helpful.', rating: 5, tag: 'Rental Turnover' },
      { name: 'Stephanie Wu', role: 'Office Manager', text: 'Our 4,000 sq ft office gets cleaned every Monday. Never missed. Always perfect. The online portal makes scheduling changes easy.', rating: 5, tag: 'Commercial Office' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4108713/pexels-photo-4108713.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3771837/pexels-photo-3771837.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Home Size', options: ['Studio / 1BR', '2 Bedrooms', '3 Bedrooms', '4 Bedrooms', '5+ Bedrooms'] },
      { label: 'Service Type', options: ['Standard Clean', 'Deep Clean', 'Move-In/Out', 'Post-Construction'] },
      { label: 'Frequency', options: ['One-Time', 'Weekly (save 20%)', 'Bi-Weekly (save 15%)', 'Monthly (save 10%)'] },
    ],
  },
  ...cleaningTemplateConfigs,
  {
    id: 'real-estate',
    industry: 'Real Estate',
    businessName: 'Vantage Realty Group',
    tagline: 'Find Your Dream Home',
    subTagline: 'Expert real estate agents with deep local knowledge. Helping buyers, sellers, and investors in the greater metro area since 2009.',
    heroImage: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#1D4ED8',
    accentLightHex: '#DBEAFE',
    accentTextHex: '#1E3A8A',
    navLinks: ['Listings', 'Buy', 'Sell', 'Contact'],
    phone: '(404) 555-0213',
    address: 'Atlanta, GA — Metro & Suburbs',
    ctaText: 'Browse Listings',
    ctaSubtext: 'View all active listings updated in real-time.',
    features: [
      { icon: Building, title: 'MLS Listings', desc: 'Full MLS integration with real-time updates, virtual tours, and saved searches.' },
      { icon: Calculator, title: 'Mortgage Calculator', desc: 'Interactive calculator lets buyers estimate payments before they call.' },
      { icon: Users, title: 'Lead Capture Forms', desc: 'Every listing page captures buyer info and routes to the right agent instantly.' },
      { icon: Video, title: 'Virtual Tours', desc: '3D Matterport tours embedded directly on each property listing page.' },
    ],
    testimonials: [
      { name: 'Brandon & Claire Hayes', role: 'First-Time Buyers', text: 'Found our perfect home in 3 weeks. The search portal and virtual tours let us narrow down before visiting in person. Saved so much time.', rating: 5, tag: 'Home Purchase' },
      { name: 'Linda Park', role: 'Home Seller', text: 'Listed on Friday, 6 offers by Monday. The property photos, virtual tour, and online listing exposure were incredible. Sold for 8% over ask.', rating: 5, tag: 'Home Sale' },
      { name: 'Marcus Johnson', role: 'Investor', text: 'Vantage manages my portfolio of 7 properties. The investor portal gives me live data on every asset. Best agency I\'ve worked with.', rating: 5, tag: 'Investment Property' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'property',
    properties: [
      { address: '4821 Peachtree Blvd NE', price: '$549,000', beds: 4, baths: 3, sqft: '2,840', img: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=500', tag: 'New Listing' },
      { address: '1107 Maple Grove Ct', price: '$389,000', beds: 3, baths: 2, sqft: '1,920', img: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=500', tag: 'Price Reduced' },
      { address: '892 Riverside Park Dr', price: '$729,000', beds: 5, baths: 4, sqft: '3,600', img: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=500', tag: 'Open House' },
    ],
  },
  {
    id: 'medical',
    industry: 'Medical Offices',
    businessName: 'ClearSmile Family Dental',
    tagline: 'Compassionate Care, Advanced Technology',
    subTagline: 'Family-friendly dental care for patients of all ages. Same-day emergency appointments available. Accepting most insurance plans.',
    heroImage: 'https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#0284C7',
    accentLightHex: '#E0F2FE',
    accentTextHex: '#0C4A6E',
    navLinks: ['Services', 'Book Online', 'Insurance', 'Contact'],
    phone: '(602) 555-0156',
    address: '3301 N. Central Ave, Phoenix, AZ',
    ctaText: 'Book an Appointment',
    ctaSubtext: 'Online booking available 24/7. Same-day slots often available.',
    features: [
      { icon: CalendarCheck, title: 'Online Booking', desc: 'Patients book their own appointments 24/7 — no hold music, no callbacks.' },
      { icon: Lock, title: 'Patient Portal', desc: 'Secure portal for records, X-rays, treatment plans, and billing.' },
      { icon: ClipboardList, title: 'Insurance Collection', desc: 'Pre-visit insurance verification forms submitted before the appointment.' },
      { icon: Bell, title: 'Automated Reminders', desc: 'SMS and email reminders that cut no-shows by up to 70%.' },
    ],
    testimonials: [
      { name: 'Patricia Gomez', role: 'Patient, 4 years', text: 'Best dental experience of my life. I book online at midnight and get a confirmation immediately. Dr. Chen is incredible.', rating: 5, tag: 'General Dentistry' },
      { name: 'Kevin Tran', role: 'Parent of 3', text: 'All three of my kids come here. The patient portal makes sharing records with school nurses so easy. Highly recommend.', rating: 5, tag: 'Family Dentistry' },
      { name: 'Denise Harper', role: 'Emergency Patient', text: 'Called at 8am with a broken tooth, seen by 10am. The online form I filled out before arrival meant zero paperwork at the office.', rating: 5, tag: 'Emergency Care' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/305566/pexels-photo-305566.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/5215254/pexels-photo-5215254.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'booking',
    services: [
      { name: 'New Patient Exam', price: '$0 with insurance', duration: '60 min' },
      { name: 'Teeth Cleaning', price: '$0–$89', duration: '45 min' },
      { name: 'Emergency Visit', price: '$99 same-day', duration: '30 min' },
    ],
  },
  {
    id: 'contractors',
    industry: 'Contractors',
    businessName: 'ProCraft Home Services',
    tagline: 'Licensed, Insured & Trusted Since 2008',
    subTagline: 'Full-service home improvement contractor specializing in kitchens, bathrooms, roofing, and whole-home renovations.',
    heroImage: 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#EA580C',
    accentLightHex: '#FFEDD5',
    accentTextHex: '#7C2D12',
    navLinks: ['Services', 'Gallery', 'Reviews', 'Get Estimate'],
    phone: '(615) 555-0187',
    address: 'Nashville, TN — Serving Middle Tennessee',
    ctaText: 'Get a Free Estimate',
    ctaSubtext: 'Free on-site consultation. No obligation.',
    features: [
      { icon: Map, title: 'Service Area Pages', desc: 'Dedicated pages for every city you serve — each ranking in local search.' },
      { icon: Award, title: 'Licensing & Insurance Display', desc: 'Prominently display your credentials to build instant trust with homeowners.' },
      { icon: Image, title: 'Before/After Gallery', desc: 'Photo galleries that show the dramatic results of your work.' },
      { icon: Star, title: '5-Star Review Program', desc: 'Automated post-project review requests that build your Google reputation.' },
    ],
    testimonials: [
      { name: 'Greg Sanders', role: 'Homeowner', text: 'Complete kitchen remodel — cabinets, countertops, appliances, tile. Finished in 3 weeks, looks like a magazine spread. Best money I ever spent.', rating: 5, tag: 'Kitchen Remodel' },
      { name: 'Kathy Williams', role: 'Homeowner', text: 'Master bath renovation from top to bottom. ProCraft\'s project management system kept us updated daily. Absolutely gorgeous result.', rating: 5, tag: 'Bathroom Renovation' },
      { name: 'James Collins', role: 'Property Investor', text: 'They\'ve renovated 4 of my rental properties. Consistent quality, on-budget, and the online estimate system makes planning easy.', rating: 5, tag: 'Investment Property' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3705522/pexels-photo-3705522.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'quote',
    quoteOptions: [
      { label: 'Service Type', options: ['Kitchen Remodel', 'Bathroom Renovation', 'Roofing', 'Flooring', 'Addition / ADU', 'Whole Home Reno'] },
      { label: 'Budget Range', options: ['$5K–$15K', '$15K–$50K', '$50K–$100K', '$100K+'] },
      { label: 'Timeline', options: ['ASAP', '1–3 months', '3–6 months', 'Flexible'] },
    ],
  },
  {
    id: 'local-services',
    industry: 'Local Services',
    businessName: 'Main Street Business Hub',
    tagline: 'More Customers. More Calls. More Revenue.',
    subTagline: 'Local digital marketing solutions for service businesses — from plumbers to pet groomers. We put you on the map and keep you there.',
    heroImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400',
    accentHex: '#0891B2',
    accentLightHex: '#CFFAFE',
    accentTextHex: '#164E63',
    navLinks: ['Services', 'Results', 'Pricing', 'Get Started'],
    phone: '(512) 555-0203',
    address: 'Austin, TX — Serving Local Businesses Nationwide',
    ctaText: 'Grow My Business',
    ctaSubtext: 'Free local SEO audit included.',
    features: [
      { icon: Search, title: 'Local SEO Rankings', desc: 'Rank in the Google 3-pack for your most valuable local search keywords.' },
      { icon: Globe, title: 'Google Business Profile', desc: 'Fully optimized GBP that drives calls, directions, and review requests.' },
      { icon: Star, title: 'Review Generation', desc: 'Automated SMS/email sequences that turn happy customers into 5-star reviews.' },
      { icon: Megaphone, title: 'Google Ads Management', desc: 'Targeted local campaigns that bring qualified customers, not tire-kickers.' },
    ],
    testimonials: [
      { name: 'Tony Reyes', role: 'Owner, Reyes Plumbing', text: 'We went from page 4 to the Google 3-pack in 8 weeks. Now we get 15–20 calls per day from Google alone. Life-changing.', rating: 5, tag: 'Plumbing' },
      { name: 'Donna Lee', role: 'Owner, Lee\'s Pet Grooming', text: 'Our Google reviews went from 12 to 247 in 6 months. Now fully booked 3 weeks out. The review system is absolutely brilliant.', rating: 5, tag: 'Pet Grooming' },
      { name: 'Chris Horton', role: 'Owner, Horton HVAC', text: 'Google Ads used to drain our budget with zero ROI. Main Street rebuilt our campaigns and our cost-per-lead dropped 65%.', rating: 5, tag: 'HVAC' },
    ],
    galleryImages: [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    widgetType: 'results',
  },
];
