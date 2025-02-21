"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getCatalogues } from "@/lib/api";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Catalogue {
  id: string;
  category: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCatalogues();
        setCatalogues(data);
      } catch (err) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Failed to load catalogue",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
        </div>
      ) : (
        <>
          <div className="p-6">
            <p className="text-3xl font-bold mb-6">Catalogues</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogues.map((catalogue) => (
                <Card
                  key={catalogue.id}
                  className="shadow-sm hover:shadow-md transition"
                >
                  <CardHeader>
                    <CardTitle className="text-xl overflow-ellipsis whitespace-nowrap overflow-hidden">
                      {catalogue.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {catalogue.category}
                    </p>
                    <div className="mt-2 h-24 overflow-hidden text-ellipsis line-clamp-4">
                      {catalogue.description}
                    </div>
                    <Link href={`/admin/catalogues/${catalogue.id}/questions`}>
                      <Button className="mt-4 w-full">View Questions</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
