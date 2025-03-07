"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { MessageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useCompletion } from '@ai-sdk/react'

const messages = `What's your favorite movie?||Do you have any pets?||What's your dream job?`;
const Message = () => {
  const { completion, complete } = useCompletion({
    api: '/api/suggest-messages'
  });
  const [isLoading, setIsLoading] = useState(false)
  const [messageLoading, setMessageLoading] = useState(false)
  const { username } = useParams()
  const form = useForm({
    resolver: zodResolver(MessageSchema)
  })
  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/send-message', {
        content: data.content,
        username
      });
      form.setValue('content', '')
      toast.success(response.data.message)
    } catch (err) {
      console.log("Error in sending message", err)
      const axiosError = err as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "Error in sending message")
    } finally {
      setIsLoading(false)
    }
  }
  const fetchMessages = async () => {
    try {
      setMessageLoading(true)
      await complete('suggest messages');
    } catch (err) {
      console.log("Error in sending message", err)
      const axiosError = err as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "Error in sending message")
    } finally {
      setMessageLoading(false)
    }
  }
  const parseMessages = (messagesString: string): Array<string> => {
    return messagesString.split('||');
  }
  const handleMessageClick = (message: string): void => {
    form.setValue('content', message)
  }
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit" className='cursor-pointer' disabled={isLoading}>
              {
                isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please Wait
                  </>
                ) : "Send It"
              }
            </Button>
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchMessages}
            className="my-4"
            disabled={messageLoading}
          >
            {messageLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </>
            ) : ('Suggest Messages')}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {parseMessages(!completion || completion === '' ? messages : completion).map((message, index) =>
              <Button
                key={index}
                variant="outline"
                className="mb-2"
                onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>)}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/signup'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div >
  )
}

export default Message