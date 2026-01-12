import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Sparkles, 
  Camera, 
  MessageCircle, 
  Wand2, 
  Search,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'AI Skincare Tools | Dermastore',
  description: 'Discover your perfect skincare routine with our AI-powered tools. Get personalized recommendations and expert advice.',
};

const aiTools = [
  {
    icon: Camera,
    title: 'AI Skin Analysis',
    description: 'Upload a photo and get instant insights about your skin type, concerns, and personalized product recommendations.',
    href: '/skin-analysis',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
  },
  {
    icon: Wand2,
    title: 'Routine Builder',
    description: 'Answer a few questions and let our AI build a complete morning and evening skincare routine tailored to your needs.',
    href: '/routine-builder',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-50',
  },
  {
    icon: Search,
    title: 'Smart Product Finder',
    description: 'Describe what you are looking for in plain language and our AI will find the perfect products for you.',
    href: '/product-finder',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
  },
  {
    icon: MessageCircle,
    title: 'Ask Derma AI',
    description: 'Chat with our AI skincare assistant for instant advice on ingredients, routines, and product recommendations.',
    href: '#chatbot',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Cape Town',
    text: 'The AI skin analysis completely changed my routine. My skin has never looked better!',
    rating: 5,
  },
  {
    name: 'Thandi K.',
    location: 'Johannesburg',
    text: 'I was using all the wrong products. The routine builder helped me find exactly what my skin needed.',
    rating: 5,
  },
  {
    name: 'Michelle P.',
    location: 'Durban',
    text: 'The product finder saved me hours of research. Found my holy grail serum in minutes!',
    rating: 5,
  },
];

export default function AIToolsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Advanced AI
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Your Personal Skincare Expert
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              Experience the future of skincare with our AI-powered tools. Get personalized 
              recommendations, build custom routines, and chat with our expert assistant.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/skin-analysis">
                  <Camera className="w-5 h-5 mr-2" />
                  Analyze My Skin
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link href="/routine-builder">
                  Build My Routine
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
              AI-Powered Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our suite of intelligent skincare tools designed to give you 
              expert-level advice and personalized recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {aiTools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className={`w-14 h-14 ${tool.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <tool.icon className={`w-7 h-7 bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`} style={{ stroke: 'url(#gradient)' }} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center text-teal-600 font-medium">
                    Try Now
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
              Real Results from Real People
            </h2>
            <p className="text-gray-600">
              See how our AI tools have transformed skincare routines across South Africa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Start with our free AI skin analysis and discover the products that will 
            work best for your unique skin.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/skin-analysis">
              Get Started Free
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
