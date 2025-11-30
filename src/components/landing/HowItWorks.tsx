import { Calendar, Users, Bell, Sparkles } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Calendar,
      title: 'Create Your Event',
      description: 'Set up your event in minutes with our easy-to-use event creation wizard. Add all the details, set capacity, and choose your approval mode.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Users,
      title: 'Manage Registrations',
      description: 'Track attendees, approve registrations, and communicate with your audience. Get real-time analytics and insights.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Bell,
      title: 'Automated Notifications',
      description: 'Keep everyone informed with automatic email confirmations, reminders, and calendar invites. Never miss a beat.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Sparkles,
      title: 'Showcase Success',
      description: 'After your event, create a beautiful showcase page with photos and highlights to share your success story.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create and manage amazing events in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm z-10">
                {index + 1}
              </div>

              {/* Card */}
              <div className="h-full p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg ${step.bgColor} flex items-center justify-center mb-4`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
