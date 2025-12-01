'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  FileText,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { eventSchema, type EventInput, eventCategories, eventTypes } from '@/lib/validations/event'
import { getCategoryIcon } from '@/lib/utils/event-utils'
import { useToast } from '@/hooks/use-toast'

const steps = [
  { id: 1, title: 'Basic Info', icon: FileText },
  { id: 2, title: 'Date & Time', icon: Calendar },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Registration', icon: Users },
  { id: 5, title: 'Review', icon: Check },
]

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema) as Resolver<EventInput>,
    defaultValues: {
      isFree: true,
      approvalMode: 'automated',
      locationType: 'physical',
      eventType: 'IN_PERSON',
      currency: 'USD',
      tags: [],
      status: 'draft', // Set default status
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: EventInput) => {
    try {
      setIsSubmitting(true)

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create event')
      }

      const event = await response.json()

      toast({
        title: 'Event created!',
        description: data.status === 'published' 
          ? 'Your event has been published successfully.' 
          : 'Your event has been saved as a draft.',
      })

      router.push(`/events/${event.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create event',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground">
          Fill in the details to create your event
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                      ${isActive ? 'border-primary bg-primary text-white' : ''}
                      ${isCompleted ? 'border-primary bg-primary text-white' : ''}
                      ${!isActive && !isCompleted ? 'border-gray-300 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-sm font-medium
                      ${isActive || isCompleted ? 'text-primary' : 'text-gray-400'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-0.5 flex-1 mx-2 transition-all
                      ${isCompleted ? 'bg-primary' : 'bg-gray-300'}
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                      
                      {/* Title */}
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Annual Tech Conference 2024"
                          {...register('title')}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-600">{errors.title.message}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your event..."
                          rows={6}
                          {...register('description')}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </div>

                      {/* Category */}
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          onValueChange={(value) => setValue('category', value as any)}
                          defaultValue={watchedValues.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                <span className="flex items-center gap-2">
                                  <span>{getCategoryIcon(category)}</span>
                                  <span>{category.replace('_', ' ')}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-sm text-red-600">{errors.category.message}</p>
                        )}
                      </div>

                      {/* Event Type */}
                      <div className="space-y-2">
                        <Label>Event Type *</Label>
                        <div className="grid grid-cols-3 gap-4">
                          {eventTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setValue('eventType', type)
                                if (type === 'VIRTUAL') {
                                  setValue('locationType', 'virtual')
                                } else if (type === 'IN_PERSON') {
                                  setValue('locationType', 'physical')
                                }
                              }}
                              className={`
                                p-4 rounded-lg border-2 transition-all text-center
                                ${watchedValues.eventType === type
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                                }
                              `}
                            >
                              <div className="font-medium">
                                {type.replace('_', ' ')}
                              </div>
                            </button>
                          ))}
                        </div>
                        {errors.eventType && (
                          <p className="text-sm text-red-600">{errors.eventType.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Date & Time */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Date & Time</h3>

                    {/* Start Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDatetime">Start Date & Time *</Label>
                        <Input
                          id="startDatetime"
                          type="datetime-local"
                          {...register('startDatetime')}
                        />
                        {errors.startDatetime && (
                          <p className="text-sm text-red-600">{errors.startDatetime.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDatetime">End Date & Time *</Label>
                        <Input
                          id="endDatetime"
                          type="datetime-local"
                          {...register('endDatetime')}
                        />
                        {errors.endDatetime && (
                          <p className="text-sm text-red-600">{errors.endDatetime.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone *</Label>
                      <Select
                        onValueChange={(value) => setValue('timezone', value)}
                        defaultValue={watchedValues.timezone || 'America/New_York'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.timezone && (
                        <p className="text-sm text-red-600">{errors.timezone.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Location */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Location Details</h3>

                    {/* Show physical location fields for IN_PERSON or HYBRID */}
                    {(watchedValues.eventType === 'IN_PERSON' || watchedValues.eventType === 'HYBRID') && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="locationVenue">Venue Name</Label>
                          <Input
                            id="locationVenue"
                            placeholder="e.g., Convention Center"
                            {...register('locationVenue')}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="locationAddress">Address *</Label>
                          <Input
                            id="locationAddress"
                            placeholder="Street address"
                            {...register('locationAddress')}
                          />
                          {errors.locationAddress && (
                            <p className="text-sm text-red-600">{errors.locationAddress.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="locationCity">City</Label>
                            <Input
                              id="locationCity"
                              placeholder="City"
                              {...register('locationCity')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="locationState">State/Province</Label>
                            <Input
                              id="locationState"
                              placeholder="State"
                              {...register('locationState')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="locationCountry">Country</Label>
                            <Input
                              id="locationCountry"
                              placeholder="Country"
                              {...register('locationCountry')}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Show virtual link for VIRTUAL or HYBRID */}
                    {(watchedValues.eventType === 'VIRTUAL' || watchedValues.eventType === 'HYBRID') && (
                      <div className="space-y-2">
                        <Label htmlFor="locationVirtualLink">Meeting Link *</Label>
                        <Input
                          id="locationVirtualLink"
                          type="url"
                          placeholder="https://zoom.us/j/..."
                          {...register('locationVirtualLink')}
                        />
                        {errors.locationVirtualLink && (
                          <p className="text-sm text-red-600">{errors.locationVirtualLink.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Registration */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Registration Settings</h3>

                    {/* Capacity */}
                    <div className="space-y-2">
                      <Label htmlFor="capacityLimit">Capacity Limit (Optional)</Label>
                      <Input
                        id="capacityLimit"
                        type="number"
                        placeholder="Leave empty for unlimited"
                        {...register('capacityLimit', { valueAsNumber: true })}
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum number of attendees
                      </p>
                    </div>

                    {/* Registration Deadline */}
                    <div className="space-y-2">
                      <Label htmlFor="registrationDeadline">Registration Deadline (Optional)</Label>
                      <Input
                        id="registrationDeadline"
                        type="datetime-local"
                        {...register('registrationDeadline')}
                      />
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isFree"
                          {...register('isFree')}
                          className="rounded"
                        />
                        <Label htmlFor="isFree" className="cursor-pointer">
                          This is a free event
                        </Label>
                      </div>

                      {!watchedValues.isFree && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...register('price', { valueAsNumber: true })}
                            />
                            {errors.price && (
                              <p className="text-sm text-red-600">{errors.price.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                              onValueChange={(value) => setValue('currency', value)}
                              defaultValue={watchedValues.currency}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="NGN">NGN (₦)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Approval Mode */}
                    <div className="space-y-2">
                      <Label>Registration Approval</Label>
                      <Select
                        onValueChange={(value) => setValue('approvalMode', value as any)}
                        defaultValue={watchedValues.approvalMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automated">Automatic Approval</SelectItem>
                          <SelectItem value="manual">Manual Approval</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 5: Review */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Review & Publish</h3>

                    <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-lg">{watchedValues.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {watchedValues.category?.replace('_', ' ')} • {watchedValues.eventType?.replace('_', ' ')}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="text-sm mt-1">{watchedValues.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Start</p>
                          <p className="text-sm mt-1">
                            {watchedValues.startDatetime && new Date(watchedValues.startDatetime).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">End</p>
                          <p className="text-sm mt-1">
                            {watchedValues.endDatetime && new Date(watchedValues.endDatetime).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Price</p>
                        <p className="text-sm mt-1">
                          {watchedValues.isFree ? 'Free' : `${watchedValues.currency} ${watchedValues.price}`}
                        </p>
                      </div>
                    </div>

                    {/* Publish Options */}
                    <div className="space-y-4">
                      <Label>Publish Status</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setValue('status', 'draft')}
                          className={`
                            p-4 rounded-lg border-2 transition-all
                            ${watchedValues.status === 'draft'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="font-medium">Save as Draft</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            You can publish later
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setValue('status', 'published')}
                          className={`
                            p-4 rounded-lg border-2 transition-all
                            ${watchedValues.status === 'published'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="font-medium">Publish Now</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Make it live immediately
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Event
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
