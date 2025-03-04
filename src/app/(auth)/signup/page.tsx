"use client"
import { useDebounceCallback } from 'usehooks-ts';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import React, { useEffect, useState } from "react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

const Signup: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [usernameMessage, setUsernameMessage] = useState<string>("");
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver<z.infer<typeof signUpSchema>>(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    useEffect(() => {
        async function checkUsernameUnique() {
            try {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                const response = await axios.get(`/api/check-username-unique?username=${username}`);
                setUsernameMessage(response.data.message);
            } catch (err) {
                const axiosError = err as AxiosError<ApiResponse>;
                console.log(err)
                setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
            } finally {
                setIsCheckingUsername(false);
            }
        }
        if (username) {
            checkUsernameUnique();
        }
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/signup', data);
            toast(response.data.message);
            router.replace(`/verify/${username}`);
        } catch (err) {
            console.log("Error in signup user");
            const axiosError = err as AxiosError<ApiResponse>;
            toast(axiosError.response?.data.message || "Error in signup user");
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Username" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }} />
                                    </FormControl>
                                    <FormDescription>
                                        {isCheckingUsername ? <Loader2 className='animate-spin' /> : usernameMessage}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            {
                                isSubmitting ? (<Loader2 className='animate-spin'>Please Wait...</Loader2>) : ('Signup')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup
