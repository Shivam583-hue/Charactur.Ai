"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Category, Companion } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import ImageUpload from './ImageUpload'

interface CompanionFormProps {
  initialData: Companion | null
  categories: Category[]
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  instructions: z.string().min(200, { message: 'Instructions should be at least 200 characters' }),
  seed: z.string().min(200, { message: 'Seed should be at least 200 characters' }),
  src: z.string().min(1, { message: 'Image is required' }),
  categoryId: z.string().min(1, { message: 'Category is required' }),

})

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {

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
    console.log(values)
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
                <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </form>
      </Form>
    </div>
  )
}

export default CompanionForm
