import { http, HttpResponse } from 'msw'
import type { ChatMessage, FormSchema } from '../../types'

const API_BASE_URL = 'http://localhost:5001'

// Mock form schema for testing
const mockFormSchema: FormSchema = {
  title: 'Contact Form',
  description: 'A simple contact form',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      validation: {
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        patternMessage: 'Please enter a valid email address',
      },
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Enter your message',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 500,
      },
    },
  ],
}

const mockGeneratedCode = `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const ContactForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Full Name *</label>
        <input {...register('name')} placeholder="Enter your full name" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email Address *</label>
        <input {...register('email')} type="email" placeholder="Enter your email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="message">Message *</label>
        <textarea {...register('message')} placeholder="Enter your message" />
        {errors.message && <p>{errors.message.message}</p>}
      </div>
      <button type="submit">Submit Form</button>
    </form>
  );
};`

export const handlers = [
  // Health check endpoint
  http.get(`${API_BASE_URL}/health`, () => {
    return HttpResponse.json({ status: 'healthy' })
  }),

  // Chat endpoint - successful response
  http.post(`${API_BASE_URL}/api/chat`, async ({ request }) => {
    const body = await request.json() as { messages: ChatMessage[] }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return HttpResponse.json({
      schema: mockFormSchema,
      code: mockGeneratedCode,
    })
  }),

  // Chat endpoint - error response (for testing error handling)
  http.post(`${API_BASE_URL}/api/chat-error`, () => {
    return HttpResponse.json(
      {
        error: {
          type: 'api_error',
          message: 'Claude API error: Rate limit exceeded',
          retry: true,
        },
      },
      { status: 500 }
    )
  }),

  // Chat endpoint - validation error
  http.post(`${API_BASE_URL}/api/chat-validation-error`, () => {
    return HttpResponse.json(
      {
        error: {
          type: 'validation_error',
          message: 'Messages are required',
          retry: false,
        },
      },
      { status: 400 }
    )
  }),
]
