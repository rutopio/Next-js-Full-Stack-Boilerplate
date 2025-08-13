"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

interface DogApiResponse {
  success: boolean;
  data?: {
    imageUrl: string;
    source: string;
  };
  error?: {
    type: string;
    message: string;
  };
  message?: string;
}

const fetchDogImage = async (): Promise<DogApiResponse> => {
  const response = await fetch("/api/dog");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function About() {
  const [queryKey, setQueryKey] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dog-image", queryKey],
    queryFn: fetchDogImage,
    enabled: queryKey > 0, // Don't fetch automatically on mount
    retry: 1,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache data
  });

  const handleGetRandomDog = () => {
    setQueryKey((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-4">
        <Badge variant="secondary">Public Page</Badge>

        <div className="text-2xl font-bold">About</div>

        <Link href="/">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeftIcon />
            Jump back to HomePage
          </Button>
        </Link>
      </div>

      <Separator className="max-w-2xl" />

      {/* Dog Image Section */}
      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center">
          <Button onClick={handleGetRandomDog} disabled={isLoading} size="lg">
            {isLoading ? "Loading..." : "API Demo: Get Random Dog Image"}
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-center text-sm text-red-800">
              <strong>Error:</strong> {error.message}
            </p>
          </div>
        )}

        {data?.success && data.data?.imageUrl && (
          <div className="space-y-4">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-lg border shadow-lg">
              <Image
                src={data.data.imageUrl}
                alt="Random dog"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Image from {data.data.source}
              </p>
            </div>
          </div>
        )}

        {!data && !isLoading && !error && (
          <div className="py-8 text-center">
            <div className="mb-4 text-6xl">🐕</div>
            <p className="text-gray-500">
              Click the button above to see a random dog!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
