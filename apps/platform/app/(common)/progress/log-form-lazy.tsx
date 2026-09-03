"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProgressLogForm = dynamic(() => import("./log-form"), {
  ssr: false,
  loading: () => <ProgressLogFormSkeleton />,
});

export default function ProgressLogFormLazy() {
  return <ProgressLogForm />;
}

function ProgressLogFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-36 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
