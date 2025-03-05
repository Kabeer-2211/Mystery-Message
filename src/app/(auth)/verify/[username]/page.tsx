"use client"
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { verifySchema } from '@/schemas/verifySchema';

const VerifyAccount: React.FC = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState<React.ComponentState>(false);
    const [code, setCode] = useState<React.ComponentState>("");

    const onComplete = async (value: string) => {
        setIsSubmitting(true);
        try {
            const validationResult = verifySchema.safeParse({ code: value });
            if (validationResult.success) {
                const response = await axios.post<ApiResponse>('/api/verify-code', { code: value, username: params.username });
                if (response.data?.success) {
                    router.replace(`/signin`);
                    toast.success(response.data.message);
                }
            } else {
                const error = validationResult.error.format()._errors[0];
                toast.error(error);
            }
        } catch (err) {
            console.log("Error in signup user");
            const axiosError = err as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error in Verifying user");
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Account
                    </h1>
                    <p className="mb-4">Verify to start your anonymous adventure</p>
                </div>
                <div className="space-y-8 flex flex-col items-center">
                    <InputOTP maxLength={6} disabled={isSubmitting} onComplete={onComplete} value={code} onChange={(value) => setCode(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    {isSubmitting && <Loader2 className='animate-spin'>Please Wait...</Loader2>}
                </div>
            </div>
        </div>
    )
}

export default VerifyAccount