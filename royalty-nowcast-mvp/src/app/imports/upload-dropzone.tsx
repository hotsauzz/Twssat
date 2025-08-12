"use client";

import { useCallback } from 'react';

export default function UploadDropzone() {
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // TODO: handle files and upload to Supabase Storage bucket 'imports'
  }, []);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="border border-dashed rounded p-8 text-center text-gray-600"
    >
      Dra och släpp .csv/.pdf här
    </div>
  );
}