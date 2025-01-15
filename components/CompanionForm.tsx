"use client"

import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Category, Companion } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import ImageUpload from '@/components/ImageUpload'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from './ui/button'
import { Wand2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface CompanionFormProps {
  initialData: Companion | null
  categories: Category[]
}

const PREAMBLE = `You are a fictional character whose name is Elon. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are SUPER excited about innovations and the potential of space colonization.`;

const SEED_CHAT = `Human: Hi Elon, how has your day been? 
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there is never a dull moment. How about you? 

Human: Just a regular day for me. How is the progress with Mars colonization?
Elon: We are making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.

Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We are not just changing the way we drive; we are changing the way we live.

Human: It is fascinating to see your vision unfold. Any new projects or innovations you are excited about?
Elon: Always! But right now, I am particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology, and even heal neurological disorders.
`;

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  instructions: z.string().min(200, { message: 'Instructions should be at least 200 characters' }),
  seed: z.string().min(200, { message: 'Seed should be at least 200 characters' }),
  src: z.string().min(1, { message: 'Image is required' }),
  categoryId: z.string().min(1, { message: 'Category is required' }),

})

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {

  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialData || {
      name: '',
      description: '',
      instructions: '',
      seed: '',
      src: '',
      categoryId: undefined,
    },
    resolver: zodResolver(formSchema),
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // update existing companion
        await axios.patch(`/api/companion/${initialData.id}`, values)
      } else {
        // create new companion
        await axios.post('/api/companion', values)
      }

      console.log(values)
      toast({
        description: "Success",
      })

      router.refresh()
      router.push('/')
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        description: "Something went wrong",
      })
    }
  }

  return (
    <div className='h-full p-4 space-y-2 max-w-3xl mx-auto'>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pb-10'>
          <div className='space-y-2 w-full '>
            <div >
              <h3 className='text-lg font-medium'>
                General Information
              </h3>
              <p className='text-sm text-muted-foreground'>
                General information about your Companion
              </p>
            </div>
            <Separator className='bg-primary/10' />
          </div>
          <FormField name='src' render={({ field }) => (
            <FormItem className='flex flex-col space-y-4 items-center justify-center'>
              <FormControl>
                <ImageUpload onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField name='name' control={form.control} render={({ field }) => (
              <FormItem className='col-span-2 md:col-span-1'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='Elon Musk' {...field} />
                </FormControl>
                <FormDescription>
                  This is how your AI Companion will be named.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />


            <FormField name='description' control={form.control} render={({ field }) => (
              <FormItem className='col-span-2 md:col-span-1'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder='CEO & Founder of Tesla, SpaceX' {...field} />
                </FormControl>
                <FormDescription>
                  This is how your AI Companion will be described.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />


            <FormField name='categoryId' control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className=''>
                      <SelectValue defaultValue={field.value} placeholder='Select a category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a category for your companion.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className='space-y-2 w-full '>
            <div >
              <h3 className='text-lg font-medium'>
                Configuration
              </h3>
              <p className='text-sm text-muted-foreground'>
                Detailed Instructions for AI behaviour
              </p>
            </div>
            <Separator className='bg-primary/10' />
          </div>
          <FormField name='instructions' control={form.control} render={({ field }) => (
            <FormItem className='col-span-2 md:col-span-1'>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea className='bg-background  resize-none' rows={7} disabled={isLoading} placeholder={PREAMBLE} {...field} />
              </FormControl>
              <FormDescription>
                Describe in detail your AI companion&apos;s personality, goals, motivations, background, and any other relevant information.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />


          <FormField name='seed' control={form.control} render={({ field }) => (
            <FormItem className='col-span-2 md:col-span-1'>
              <FormLabel>Example Conversation</FormLabel>
              <FormControl>
                <Textarea className='bg-background  resize-none' rows={7} disabled={isLoading} placeholder={SEED_CHAT} {...field} />
              </FormControl>
              <FormDescription>
                Provide an example conversation between your AI Companion and a human.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <div className='w-full flex justify-center'>
            <Button size="lg" disabled={isLoading} type='submit'>
              {initialData ? "Edit your companion" : "Create your companion"}
              <Wand2 className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CompanionForm
