"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type BusinessInfo = {
  id: string;
  name: string;
  email: string;
};

const Page = () => {
  const [data, setData] = useState<BusinessInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      const { data: result, error: fetchError } = await supabase
        .from("business_info")
        .select("*");

      if (fetchError) {
        console.error("Supabase Error:", fetchError);
        setError(fetchError.message);
      } else {
        console.log("Supabase Data:", result);
        setData(result ?? []);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Supabase Test Page</h1>

      {error && <p className="text-red-500">Error: {error}</p>}

      {data.length > 0 ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.name} — {item.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found (or table empty)</p>
      )}
    </div>
  );
};

export default Page;